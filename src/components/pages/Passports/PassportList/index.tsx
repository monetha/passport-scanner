import React, { Fragment } from 'react';
import { Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { IPassportRef } from 'src/models/passport';
import './style.scss';
import { translate } from 'src/i18n';
import { Link, withRouter } from 'react-router-dom';
import { routes } from 'src/constants/routes';
import { getServices } from 'src/ioc/services';
import { ethNetworkUrls, etherscanUrls } from 'src/constants/api';
import BigNumber from 'bignumber.js';
import { Table } from 'src/components/layout/Table';
import { Alert, AlertType } from 'src/components/indicators/Alert';
import { createRouteUrl } from 'src/utils/nav';
import { RouteChildrenProps } from 'react-router';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends RouteChildrenProps<any> {
  items: IPassportRef[];
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class PassportList extends React.PureComponent<IProps> {

  public render() {
    const { items } = this.props;
    if (!items) {
      return null;
    }

    if (items.length === 0) {
      return <Alert type={AlertType.Info}>{translate(t => t.common.noData)}</Alert>;
    }

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
        <Td>{this.renderPassportAddress(item)}</Td>
        <Td>{this.renderOwnerAddress(item)}</Td>
        <Td>{this.renderBlockNumber(item)}</Td>
        <Td>{this.renderTxHash(item)}</Td>
      </Tr>
    );
  }

  private renderPassportAddress(item: IPassportRef) {
    const { passportAddress, blockNumber } = item;

    const url = createRouteUrl(this.props.location, `${routes.PassportChanges}/${passportAddress}`, {
      start_block: blockNumber,
    });

    return (
      <Link to={url}>
        {passportAddress}
      </Link>
    );
  }

  private renderOwnerAddress(item: IPassportRef) {
    const { ownerAddress } = item;

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

  private renderBlockNumber(item: IPassportRef) {
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

  private renderTxHash(item: IPassportRef) {
    const { txHash } = item;

    const url = this.getEtherscanUrl();
    if (!url) {
      return txHash;
    }

    return (
      <a
        href={`${url}/tx/${txHash}`}
        target='_blank'
      >
        {txHash}
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

const routed = withRouter(PassportList);
export { routed as PassportList };
