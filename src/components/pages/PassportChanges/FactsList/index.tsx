import BigNumber from 'bignumber.js';
import groupBy from 'lodash/groupBy';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { DataType, EventType, IFactValue } from 'reputation-sdk';
import { Loader } from 'src/components/indicators/Loader';
import { Table } from 'src/components/layout/Table';
import { etherscanUrls, ethNetworkUrls, ipfsGatewayUrl } from 'src/constants/api';
import { knownFactProviders } from 'src/constants/factProviders';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { translate } from 'src/i18n';
import translations from 'src/i18n/locales/en';
import { getServices } from 'src/ioc/services';
import { IFact } from 'src/models/passport';
import { loadFactValue } from 'src/state/passport/actions';
import { IFactValueWrapper } from 'src/state/passport/models';
import { IState } from 'src/state/rootReducer';
import './style.scss';

// #region -------------- Interfaces --------------------------------------------------------------

interface IStateProps {
  factValues: { [txHash: string]: IAsyncState<IFactValueWrapper> };
}

interface IDispatchProps {
  onLoadFactValue(fact: IFact);
}

export interface IProps extends IStateProps, IDispatchProps {
  items: IFact[];
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class FactsList extends React.PureComponent<IProps> {

  public render() {
    return (
      <div className='mh-facts-list'>
        {this.renderGroups()}
      </div>
    );
  }

  private renderGroups() {
    const { items } = this.props;

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
            {`${translate(t => t.passport.factProvider)}: `}
            {this.renderFactProviderName(factProviderAddress)}
          </div>

          <Table>
            <Thead>
              <Tr>
                <Th>{translate(t => t.passport.key)}</Th>
                <Th>{translate(t => t.passport.dataType)}</Th>
                <Th>{translate(t => t.passport.changeType)}</Th>
                <Th>{translate(t => t.passport.value)}</Th>
                <Th>{translate(t => t.passport.blockNumber)}</Th>
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

    return renderedGroups;
  }

  private renderItem(item: IFact) {
    return (
      <Tr>
        <Td>{item.key}</Td>
        <Td>{this.renderDataType(item)}</Td>
        <Td>{this.renderEventType(item)}</Td>
        <Td>{this.renderValue(item)}</Td>
        <Td>{this.renderBlockNumber(item)}</Td>
        <Td>{this.renderTxHash(item)}</Td>
      </Tr>
    );
  }

  private renderFactProviderName(address: string) {
    let name = address;
    if (knownFactProviders[address.toLowerCase()]) {
      name = knownFactProviders[address.toLowerCase()];
    }

    const url = this.getEtherscanUrl();
    if (!url) {
      return name;
    }

    return (
      <a
        href={`${url}/address/${address}`}
        target='_blank'
      >
        {name}
      </a>
    );
  }

  private renderDataType(item: IFact) {
    const transKey = translations.passport.dataTypes[item.dataType];
    if (!transKey) {
      return item.dataType;
    }

    return translate(t => t.passport.dataTypes[item.dataType]);
  }

  private renderEventType(item: IFact) {
    const transKey = translations.passport.eventTypes[item.eventType];
    if (!transKey) {
      return item.eventType;
    }

    return translate(t => t.passport.eventTypes[item.eventType]);
  }

  private renderBlockNumber(item: IFact) {
    const { blockNumber } = item;

    const decBlockNr = new BigNumber(blockNumber, 16).toString(10);

    const url = this.getEtherscanUrl();
    if (!url) {
      return decBlockNr;
    }

    return (
      <a
        href={`${url}/block/${decBlockNr}`}
        target='_blank'
      >
        {decBlockNr}
      </a>
    );
  }

  private renderTxHash(item: IFact) {
    const { transactionHash } = item;

    const url = this.getEtherscanUrl();
    if (!url) {
      return transactionHash;
    }

    return (
      <a
        href={`${url}/tx/${transactionHash}`}
        target='_blank'
      >
        {transactionHash}
      </a>
    );
  }

  private getEtherscanUrl() {
    const { ethNetworkUrl } = getServices();

    switch (ethNetworkUrl) {
      case ethNetworkUrls.ropsten:
        return etherscanUrls.ropsten;

      case ethNetworkUrls.mainnet:
        return etherscanUrls.mainnet;

      default:
        return null;
    }
  }

  // #region -------------- Fact value -------------------------------------------------------------------

  private renderValue(item: IFact) {
    if (item.eventType !== EventType.Updated) {
      return null;
    }

    const { factValues } = this.props;
    const value = factValues[item.transactionHash];

    if (value) {
      if (value.isFetching) {
        return (
          <Loader />
        );
      }

      if (value.data !== undefined) {
        return (
          <div className='mh-value'>
            {this.renderDownloadedValue(value.data)}
          </div>
        )
      }
    }

    return (
      <div className='mh-button-container'>
        <button
          type='button'
          onClick={() => this.onLoadClick(item)}
        >
          {translate(t => t.common.load)}
        </button>
      </div>
    );
  }

  private renderDownloadedValue(data: IFactValueWrapper) {
    if (!data || !data.value || data.value.value === undefined || data.value.value === null) {
      return '';
    }

    const { value } = data.value;

    switch (data.dataType) {
      case DataType.Address:
        return this.renderAddressValue(value);

      case DataType.Bytes:
      case DataType.TxData:
        return (
          <div className='mh-button-container'>
            <button
              type='button'
              onClick={() => this.onDownloadBytes(data.value)}
            >
              {translate(t => t.common.download)}
            </button>
          </div>
        );

      case DataType.IPFSHash:
        return (
          <a
            href={`${ipfsGatewayUrl}/${value}`}
            target='_blank'
          >
            {value}
          </a>
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
    const url = this.getEtherscanUrl();
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

  private onLoadClick = (fact: IFact) => {
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
      onLoadFactValue(fact: IFact) {
        dispatch(loadFactValue.init({ passportAddress: null, fact }));
      },
    };
  },
)(FactsList);

export { connected as FactsList };

// #endregion
