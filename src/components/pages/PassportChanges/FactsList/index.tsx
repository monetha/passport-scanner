import groupBy from 'lodash/groupBy';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import Modal from 'react-responsive-modal';
import { Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { FactProviderInfoLoader } from 'src/components/facts/FactProviderInfoLoader';
import { PrivateDataExchanger } from 'src/components/facts/PrivateDataExchanger';
import { TextValueViewer } from 'src/components/facts/TextValueViewer';
import { ActionButton } from 'src/components/form/ActionButton';
import { Alert, AlertType } from 'src/components/indicators/Alert';
import { Loader } from 'src/components/indicators/Loader';
import { Share } from 'src/components/indicators/Share';
import { Table } from 'src/components/layout/Table';
import { ipfsGatewayUrl } from 'src/constants/api';
import { routes } from 'src/constants/routes';
import { screenQuery } from 'src/constants/screen';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { getEtherscanUrl, getShortId } from 'src/helpers';
import { translate } from 'src/i18n';
import translations from 'src/i18n/locales/en';
import { IPassportInformation, loadFactValue } from 'src/state/passport/actions';
import { IFactValueWrapper } from 'src/state/passport/models';
import { IState } from 'src/state/rootReducer';
import { DataType, EventType, IFactProviderInfo, IFactValue, IHistoryEvent } from 'verifiable-data';
import './style.scss';
import { Button } from 'src/components/form/Button';
import { DropdownIndicator } from 'src/components/indicators/DropdownIndicator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { RouteComponentProps, withRouter } from 'react-router';
import { parse } from 'query-string';

// #region -------------- Interfaces --------------------------------------------------------------

interface ILocalState {
  popups: any;
  modalOpened: boolean;
  txHashInModal: string;
  modalContent: {
    [key: string]: string;
  };
  expandedChanges: Set<string>;
}

interface IStateProps {
  factValues: { [txHash: string]: IAsyncState<IFactValueWrapper> };
}

interface IDispatchProps {
  onLoadFactValue(fact: IHistoryEvent);
}

export interface IProps extends IStateProps, IDispatchProps, RouteComponentProps {
  items: IHistoryEvent[];
  passportInformation: IPassportInformation;
  factKey?: string;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class FactsList extends React.PureComponent<IProps, ILocalState> {
  public readonly state: Readonly<ILocalState> = {
    popups: {},
    modalOpened: false,
    txHashInModal: '',
    modalContent: {},
    expandedChanges: new Set<string>(),
  };

  public componentDidUpdate(prevProps: IProps) {
    this.processJustLoadedFacts(prevProps);
  }

  public render() {
    return (
      <div className='mh-facts-list'>
        {this.renderHeader()}
        {this.renderGroups()}
        {this.renderModal()}
      </div>
    );
  }

  private isChangeExpanded(txHash: string) {
    const { expandedChanges } = this.state;

    return expandedChanges.has(txHash);
  }

  private toggleChangeExpansion = (txHash: string) => {
    const { expandedChanges } = this.state;

    const setCopy = new Set(expandedChanges);

    if (setCopy.has(txHash)) {
      setCopy.delete(txHash);
    } else {
      setCopy.add(txHash);
    }

    this.setState({
      expandedChanges: setCopy,
    });
  }

  // #region -------------- Header -------------------------------------------------------------------

  private renderHeader() {
    return (
      <div>
        <h2>{translate(t => t.passport.factChanges)}</h2>
      </div>
    );
  }

  // #endregion

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

          <MediaQuery query={screenQuery.responsiveTableDesktop}>
            {this.renderDesktopTable(facts)}
          </MediaQuery>

          <MediaQuery query={screenQuery.responsiveTableMobile}>
            {this.renderMobileTable(facts)}
          </MediaQuery>
        </div>
      ));
    }

    if (renderedGroups.length === 0) {
      return (
        <div>
          <Alert type={AlertType.Info}>{translate(t => t.common.noData)}</Alert>
        </div>
      );
    }

    return renderedGroups;
  }

  private renderDesktopTable(facts: IHistoryEvent[]) {
    return (
      <div className='mh-desktop-table-container'>
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
                {this.renderDesktopItem(f)}
              </Fragment>
            ))}
          </Tbody>
        </Table>
      </div>
    );
  }

  private renderMobileTable(facts: IHistoryEvent[]) {
    return (
      <div className='mh-mobile-table-container'>
        <Table>
          <Thead>
            <Tr>
              <Th><span className='mh-hidden'>{translate(t => t.passport.key)}</span></Th>
              <Th><span className='mh-hidden'>{translate(t => t.passport.value)}</span></Th>
              <Th>{translate(t => t.passport.dataType)}</Th>
              <Th>{translate(t => t.passport.changeType)}</Th>
              <Th>{translate(t => t.passport.blockNumber)}</Th>
              <Th>{translate(t => t.passport.txHash)}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {facts.map(f => (
              <Fragment key={f.transactionHash}>
                {this.renderMobileItem(f)}
              </Fragment>
            ))}
          </Tbody>
        </Table>
      </div>
    );
  }

  // #endregion

  // #region -------------- Row columns-------------------------------------------------------------------

  private renderDesktopItem(item: IHistoryEvent) {
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

  private renderMobileItem(item: IHistoryEvent) {
    const isExpanded = this.isChangeExpanded(item.transactionHash);
    const visibilityClass = isExpanded ? '' : 'mh-hidden';

    const expander = (
      <Button
        data-txhash={item.transactionHash}
        className='mh-expander-button'
        onClick={this.onExpanderClick}
      >
        {isExpanded ?
          translate(t => t.common.seeLess) :
          translate(t => t.common.seeMore)
        }

        <DropdownIndicator
          isOpened={isExpanded}
        />
      </Button>
    );

    return (
      <Tr>
        <Td className='mh-mobile-field-key'>
          <div>
            <div className='mh-text'>{item.key}</div>
            <div className='mh-icon'>
              {item.eventType === EventType.Deleted ?
                <FontAwesomeIcon className='mh-deleted-icon' icon={faMinusSquare} /> :
                <FontAwesomeIcon className='mh-updated-icon' icon={faPenSquare} />}
            </div>
          </div>
        </Td>
        <Td className='mh-mobile-field-value'>
          {this.renderValue(item, translate(t => t.common.viewValue))}

          {!isExpanded && expander}
        </Td>
        <Td className={visibilityClass}>{this.renderDataType(item)}</Td>
        <Td className={visibilityClass}>{this.renderEventType(item)}</Td>
        <Td className={visibilityClass}>{this.renderBlockNumber(item)}</Td>
        <Td className={visibilityClass}>
          {this.renderTxHash(item)}

          {isExpanded && expander}
        </Td>
      </Tr>
    );
  }

  private onExpanderClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const txHash = e.currentTarget.dataset.txhash as string;

    this.toggleChangeExpansion(txHash);
  }

  private renderFactProviderName(address: string, passportOwnerAddress: string) {
    return (
      <FactProviderInfoLoader
        factProviderAddress={address}
        dataForChildren={passportOwnerAddress}
      >
        {this.renderLoadedFactProviderName}
      </FactProviderInfoLoader>
    );
  }

  private renderLoadedFactProviderName(
    factProviderInfo: IAsyncState<IFactProviderInfo>,
    factProviderAddress: string,
    ownerAddress: string,
  ) {
    let name;

    if (factProviderAddress.toLowerCase() === ownerAddress.toLowerCase()) {
      name = translate(t => t.passport.owner);
    } else if (factProviderInfo && factProviderInfo.data) {
      name = factProviderInfo.data.name;
    }

    const url = getEtherscanUrl();
    if (!url) {
      return name || factProviderAddress;
    }

    return (
      <a
        href={`${url}/address/${factProviderAddress}`}
        target='_blank'
        className='mh-fact-provider-name'
      >
        {name || factProviderAddress}
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

  private renderValue(event: IHistoryEvent, label?: string) {
    if (event.eventType !== EventType.Updated) {
      return null;
    }

    const { factValues, factKey } = this.props;
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
            {this.renderDownloadedValue(value.data, event, label)}
          </div>
        );
      }
    }

    if (event.dataType === DataType.PrivateData && factKey === event.key) {
      this.props.onLoadFactValue(event);
      return null;
    }

    return (
      <ActionButton
        onClick={() => this.onLoadClick(event)}
        className='mh-view-value'
        text={label || translate(t => t.common.view)}
      />
    );
  }

  private renderDownloadedValue(data: IFactValueWrapper, event: IHistoryEvent, label?: string) {
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
            text={label || translate(t => t.common.view)}
          />
        );

      case DataType.IPFSHash:
        return (
          <ActionButton
            onClick={() => window.open(`${ipfsGatewayUrl}/${value}`, '_blank')}
            className='mh-view-value'
            text={label || translate(t => t.common.view)}
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

const connected = withRouter(connect<IStateProps, IDispatchProps>(
  (state: IState, ownProps: IProps) => {
    const parsed: any = parse(ownProps.location.search);
    return {
      factValues: state.passport.factValues,
      factKey: parsed.fact_key || '',
    };
  },
  (dispatch) => {
    return {
      onLoadFactValue(fact: IHistoryEvent) {
        dispatch(loadFactValue.init({ passportAddress: null, fact }));
      },
    };
  },
)(FactsList));

export { connected as FactsList };

// #endregion
