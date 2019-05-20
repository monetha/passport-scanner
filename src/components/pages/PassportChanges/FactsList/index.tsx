import React, { Fragment } from 'react';
import { Tbody, Thead, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Table } from 'src/components/layout/Table';
import { etherscanUrls, ethNetworkUrls } from 'src/constants/api';
import { getServices } from 'src/ioc/services';
import { IFact } from 'src/models/passport';
import './style.scss';
import { translate } from 'src/i18n';
import BigNumber from 'bignumber.js';
import translations from 'src/i18n/locales/en';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  items: IFact[];
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class FactsList extends React.PureComponent<IProps> {

  public render() {
    return (
      <div className='mh-facts-list'>
        <Table>
          <Thead>
            <Tr>
              <Th>{translate(t => t.passport.factProviderAddress)}</Th>
              <Th>{translate(t => t.passport.key)}</Th>
              <Th>{translate(t => t.passport.dataType)}</Th>
              <Th>{translate(t => t.passport.changeType)}</Th>
              <Th>{translate(t => t.passport.value)}</Th>
              <Th>{translate(t => t.passport.blockNumber)}</Th>
              <Th>{translate(t => t.passport.txHash)}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {this.renderItems()}
          </Tbody>
        </Table>
      </div>
    );
  }

  private renderItems() {
    const { items } = this.props;

    if (!items) {
      return null;
    }

    return items.map((item, index) => {
      return (
        <Fragment key={index}>
          {this.renderItem(item)}
        </Fragment>
      );
    });
  }

  private renderItem(item: IFact) {
    return (
      <Tr>
        <Td>{this.renderFactProviderAddress(item)}</Td>
        <Td>{item.key}</Td>
        <Td>{this.renderDataType(item)}</Td>
        <Td>{this.renderEventType(item)}</Td>
        <Td>{this.renderValue(item)}</Td>
        <Td>{this.renderBlockNumber(item)}</Td>
        <Td>{this.renderTxHash(item)}</Td>
      </Tr>
    );
  }

  private renderFactProviderAddress(item: IFact) {
    const { factProviderAddress } = item;

    const url = this.getEtherscanUrl();
    if (!url) {
      return factProviderAddress;
    }

    return (
      <a
        href={`${url}/address/${factProviderAddress}`}
        target='_blank'
      >
        {factProviderAddress}
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

  private renderValue(_: IFact) {
    return 'Download';
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
}

// #endregion
