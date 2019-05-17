import React, { Fragment } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { IPassportRef } from 'src/models/passport';
import './style.scss';
import { translate } from 'src/i18n';
import { Link } from 'react-router-dom';
import { routes } from 'src/constants/routes';
import { getServices } from 'src/ioc/services';
import { ethNetworkUrls, etherscanUrls } from 'src/constants/api';
import BigNumber from 'bignumber.js';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  items: IPassportRef[];
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class PassportList extends React.PureComponent<IProps> {

  public render() {
    return (
      <div className='mh-passport-list'>
        <Table>
          <Thead>
            <Tr>
              <Th>{translate(t => t.passport.passportAddress)}</Th>
              <Th>{translate(t => t.passport.firstOwnerAddress)}</Th>
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

  private renderItem(item: IPassportRef) {
    return (
      <Tr>
        <Td>{this.renderPassportAddress(item.passportAddress)}</Td>
        <Td>{this.renderOwnerAddress(item.ownerAddress)}</Td>
        <Td>{this.renderBlockNumber(item.blockNumber)}</Td>
        <Td>{this.renderTxHash(item.txHash)}</Td>
      </Tr>
    );
  }

  private renderPassportAddress(address: string) {
    return (
      <Link to={`${routes.FactProviders}/${address}`}>
        {address}
      </Link>
    )
  }

  private renderOwnerAddress(ownerAddress: string) {
    const url = this.getEtherscanUrl();
    if (!url) {
      return ownerAddress;
    }

    return (
      <a
        href={`${url}/address/${ownerAddress}`}
        target='_blank'
      >
        {ownerAddress}
      </a>
    );
  }

  private renderBlockNumber(blockNumber: string) {
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

  private renderTxHash(tx: string) {
    const url = this.getEtherscanUrl();
    if (!url) {
      return tx;
    }

    return (
      <a
        href={`${url}/tx/${tx}`}
        target='_blank'
      >
        {tx}
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
        return null;;
    }
  }
}

// #endregion
