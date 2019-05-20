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
import groupBy from 'lodash/groupBy';

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
            {this.renderFactProviderAddress(factProviderAddress)}
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

  private renderFactProviderAddress(address: string) {
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
