import groupBy from 'lodash/groupBy';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { DataType, EventType, IFactValue, IHistoryEvent } from 'verifiable-data';
import { Loader } from 'src/components/indicators/Loader';
import { Table } from 'src/components/layout/Table';
import { ipfsGatewayUrl } from 'src/constants/api';
import { knownFactProviders } from 'src/constants/factProviders';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { translate } from 'src/i18n';
import translations from 'src/i18n/locales/en';
import { IPassportInformation, loadFactValue } from 'src/state/passport/actions';
import { IFactValueWrapper } from 'src/state/passport/models';
import { IState } from 'src/state/rootReducer';
import './style.scss';
import { Alert, AlertType } from 'src/components/indicators/Alert';
import { Share } from 'src/components/indicators/Share';
import { ActionButton } from 'src/components/form/ActionButton';
import { getShortId, getEtherscanUrl } from 'src/helpers';
import { PassportInformation } from 'src/components/pages/PassportChanges/PassportInformation';
import { routes } from 'src/constants/routes';
import Modal from 'react-responsive-modal';
import { PrivateDataExchanger } from 'src/components/facts/PrivateDataExchanger';
import { TextValueViewer } from 'src/components/facts/TextValueViewer';

// #region -------------- Interfaces --------------------------------------------------------------

interface ILocalState {
  popups: any;
  modalOpened: boolean;
  txHashInModal: string;
  modalContent: {
    [key: string]: string;
  };
}

interface IStateProps {
  factValues: { [txHash: string]: IAsyncState<IFactValueWrapper> };
}

interface IDispatchProps {
  onLoadFactValue(fact: IHistoryEvent);
}

export interface IProps extends IStateProps, IDispatchProps {
  items: IHistoryEvent[];
  passportInformation: IPassportInformation;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class FactsList extends React.PureComponent<IProps, ILocalState> {
  public readonly state: Readonly<ILocalState> = {
    popups: {},
    modalOpened: false,
    txHashInModal: '',
    modalContent: {},
  };

  public componentDidUpdate(prevProps: IProps) {
    this.processJustLoadedFacts(prevProps);
  }

  public render() {
    return (
      <div className='mh-facts-list'>
        <PassportInformation
          passportInformation={this.props.passportInformation}
        />
        {this.renderGroups()}
        {this.renderModal()}
      </div>
    );
  }

  // #region -------------- Table fact provider groups -------------------------------------------------------------------

  private renderGroups() {
    const { items, passportInformation } = this.props;

    if (!items) {
      return null;
    }

    // Group items by fact provider
    const grouped = groupBy(items, i => i.factProviderAddress);

    const renderedGroups = [];

    for (const factProviderAddress in grouped) {
      if (!grouped.hasOwnProperty(factProviderAddress)) {
        continue;
      }

      const facts = grouped[factProviderAddress];

      renderedGroups.push((
        <div
          className='mh-fact-group'
          key={factProviderAddress}
        >
          <div className='mh-fact-provider-header'>
            <span className='mh-fact-provider'>{`${translate(t => t.passport.factProvider)}: `}</span>
            {this.renderFactProviderName(factProviderAddress, passportInformation.passportOwnerAddress)}
          </div>

          <Table>
            <Thead>
              <Tr>
                <Th>{translate(t => t.passport.blockNumber)}</Th>
                <Th>{translate(t => t.passport.key)}</Th>
                <Th>{translate(t => t.passport.value)}</Th>
                <Th>{translate(t => t.passport.dataType)}</Th>
                <Th>{translate(t => t.passport.changeType)}</Th>
                <Th>{translate(t => t.passport.txHash)}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {facts.map(f => (
                <Fragment key={f.transactionHash}>
                  {this.renderItem(f)}
                </Fragment>
              ))}
            </Tbody>
          </Table>
        </div>
      ));
    }

    if (renderedGroups.length === 0) {
      return <Alert type={AlertType.Info}>{translate(t => t.common.noData)}</Alert>;
    }

    return renderedGroups;
  }

  // #endregion

  // #region -------------- Row columns-------------------------------------------------------------------

  private renderItem(item: IHistoryEvent) {
    return (
      <Tr>
        <Td>{this.renderBlockNumber(item)}</Td>
        <Td>{item.key}</Td>
        <Td>{this.renderValue(item)}</Td>
        <Td>{this.renderDataType(item)}</Td>
        <Td>{this.renderEventType(item)}</Td>
        <Td>{this.renderTxHash(item)}</Td>
      </Tr>
    );
  }

  private renderFactProviderName(address: string, passportOwnerAddress: string) {
    let name = address;
    const lcAddress = address.toLowerCase();

    if (lcAddress === passportOwnerAddress.toLowerCase()) {
      name = translate(t => t.passport.owner);
    } else if (knownFactProviders[lcAddress]) {
      name = knownFactProviders[lcAddress];
    }

    const url = getEtherscanUrl();
    if (!url) {
      return name;
    }

    return (
      <a
        href={`${url}/address/${address}`}
        target='_blank'
        className='mh-fact-provider-name'
      >
        {name}
      </a>
    );
  }

  private renderDataType(item: IHistoryEvent) {
    const transKey = translations.passport.dataTypes[item.dataType];
    if (!transKey) {
      return item.dataType;
    }

    return translate(t => t.passport.dataTypes[item.dataType]);
  }

  private renderEventType(item: IHistoryEvent) {
    const transKey = translations.passport.eventTypes[item.eventType];
    if (!transKey) {
      return item.eventType;
    }

    return translate(t => t.passport.eventTypes[item.eventType]);
  }

  private renderBlockNumber(item: IHistoryEvent) {
    const { blockNumber } = item;

    const url = getEtherscanUrl();
    if (!url) {
      return blockNumber;
    }

    return (
      <>
        <Share />
        <a
          href={`${url}/block/${blockNumber}`}
          target='_blank'
        >
          {blockNumber}
        </a>
      </>
    );
  }

  private renderTxHash(item: IHistoryEvent) {
    const { transactionHash: transactionHashOriginal } = item;
    const transactionHash = getShortId(transactionHashOriginal);

    const url = getEtherscanUrl();
    if (!url) {
      return transactionHash;
    }

    return (
      <>
        <Share />
        <a
          href={`${url}/tx/${transactionHashOriginal}`}
          target='_blank'
        >
          {transactionHash}
        </a>
      </>
    );
  }

  // #endregion

  // #region -------------- Fact value column -------------------------------------------------------------------

  private renderValue(event: IHistoryEvent) {
    if (event.eventType !== EventType.Updated) {
      return null;
    }

    const { factValues } = this.props;
    const value = factValues[event.transactionHash];

    if (value) {
      if (value.isFetching) {
        return (
          <Loader />
        );
      }

      if (value.data !== undefined) {
        return (
          <div className='mh-value'>
            {this.renderDownloadedValue(value.data, event)}
          </div>
        );
      }
    }

    return (
      <ActionButton
        onClick={() => this.onLoadClick(event)}
        className='mh-view-value'
        text={translate(t => t.common.view)}
      />
    );
  }

  private renderDownloadedValue(data: IFactValueWrapper, event: IHistoryEvent) {
    if (!data || !data.value || data.value.value === undefined || data.value.value === null) {
      return '';
    }

    const { value } = data.value;

    switch (data.dataType) {
      case DataType.Address:
        return this.renderAddressValue(value);

      case DataType.Bytes:
      case DataType.TxData:
      case DataType.PrivateData:
        return (
          <ActionButton
            onClick={() => this.setState({
              modalOpened: true,
              txHashInModal: event.transactionHash,
            })}
            className='mh-download'
            text={translate(t => t.common.view)}
          />
        );

      case DataType.IPFSHash:
        return (
          <ActionButton
            onClick={() => window.open(`${ipfsGatewayUrl}/${value}`, '_blank')}
            className='mh-view-value'
            text={translate(t => t.common.view)}
          />
        );

      case DataType.String:
      case DataType.Int:
      case DataType.Uint:
        return value;

      case DataType.Bool:
      default:
        return value.toString();
    }
  }

  private renderAddressValue(address: string) {
    const url = getEtherscanUrl();
    if (!url) {
      return address;
    }

    return (
      <a
        href={`${url}/address/${address}`}
        target='_blank'
      >
        {address}
      </a>
    );
  }

  private onLoadClick = (fact: IHistoryEvent) => {
    switch (fact.dataType) {

      // For IPFS - open new tab immediately and show loader until gateway url is available
      case DataType.IPFSHash:
        this.setState(({ popups }) => ({
          popups: {
            ...popups,
            [fact.transactionHash]: window.open(routes.Loading, '_blank'),
          },
        }));
        break;
    }

    this.props.onLoadFactValue(fact);
  }

  private onDownloadBytes = (factValue: IFactValue<number[]>) => {
    const uintArray = new Uint8Array(factValue.value);
    const blob = new Blob([uintArray], {
      type: 'octet/stream',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${factValue.factProviderAddress}_${factValue.key}`;
    link.click();
  }

  private getJustLoadedFactValues = (prevProps: IProps) => {
    const { factValues } = this.props;

    return Object.entries(factValues).filter(([txHash, valueState]) => {
      if (!valueState) {
        return false;
      }

      // Value must be retrieved
      if (!valueState.data || valueState.isFetching) {
        return false;
      }

      // Value must transition from isFetching state
      const prevValue = prevProps.factValues[txHash];
      if (!prevValue || !prevValue.isFetching) {
        return false;
      }

      return true;
    }).map(([txHash, valueState]) => ({
      dataType: valueState.data.dataType,
      value: valueState.data.value,
      txHash,
    }));
  }

  private processJustLoadedFacts = (prevProps: IProps) => {
    const { factValues } = this.props;

    // No change in fact values? exit
    if (prevProps.factValues === factValues || !prevProps.factValues) {
      return;
    }

    const justLoadedFactValues = this.getJustLoadedFactValues(prevProps);
    justLoadedFactValues.forEach(({ dataType, value, txHash }) => {

      // Data was just fetched. Do action for some data types
      switch (dataType) {
        case DataType.IPFSHash:
          if (!this.state.popups[txHash]) {
            return;
          }

          this.state.popups[txHash].location.replace(`${ipfsGatewayUrl}/${value.value}`);
          return;

        case DataType.PrivateData:
        case DataType.TxData:
          this.setState({
            modalOpened: true,
            txHashInModal: txHash,
          });
          return;

        case DataType.Bytes:
          this.onDownloadBytes(value);
          return;
      }
    });
  }

  private renderModal() {
    if (!this.state.modalOpened) {
      return null;
    }

    const factValueState = this.props.factValues[this.state.txHashInModal];
    if (!factValueState || !factValueState.isFetched || !factValueState.data) {
      return null;
    }

    const factValue = factValueState.data;
    let modalContent;

    switch (factValue.dataType) {
      case DataType.PrivateData:
        modalContent = (
          <PrivateDataExchanger
            factValue={factValue.value}
          />
        );
        break;

      default:
        modalContent = (
          <TextValueViewer
            factValue={factValue}
            onDownload={this.onDownloadBytes}
          />
        );
        break;
    }

    return (
      <Modal
        open={this.state.modalOpened}
        onClose={this.toggleModal}
        classNames={{
          modal: 'mh-modal-container',
        }}
        center
      >
        {modalContent}
      </Modal>
    );
  }

  private toggleModal = () => {
    this.setState(prevState => ({
      modalOpened: !prevState.modalOpened,
    }));
  }

  // #endregion
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps>(
  (state: IState) => {
    return {
      factValues: state.passport.factValues,
    };
  },
  (dispatch) => {
    return {
      onLoadFactValue(fact: IHistoryEvent) {
        dispatch(loadFactValue.init({ passportAddress: null, fact }));
      },
    };
  },
)(FactsList);

export { connected as FactsList };

// #endregion
