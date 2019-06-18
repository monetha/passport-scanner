import React, { Fragment } from 'react';
import { Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { IPassportRef } from 'src/models/passport';
import './style.scss';
import { translate } from 'src/i18n';
import { Link, withRouter } from 'react-router-dom';
import { routes } from 'src/constants/routes';
import BigNumber from 'bignumber.js';
import { Table } from 'src/components/layout/Table';
import { Share } from 'src/components/pages/PassportChanges/Share';
import { OwnerAddress } from 'src/components/OwnerAddress';
import { Alert, AlertType } from 'src/components/indicators/Alert';
import { createRouteUrl } from 'src/utils/nav';
import { RouteChildrenProps } from 'react-router';
import { getShortId, getEtherscanUrl } from 'src/helpers';

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
        <h2>{translate(t => t.passport.passports)}</h2>

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
        <Td><OwnerAddress ownerAddressOriginal={item.ownerAddress} shorten={true} /></Td>
        <Td>{this.renderBlockNumber(item)}</Td>
        <Td>{this.renderTxHash(item)}</Td>
      </Tr>
    );
  }

  private renderPassportAddress(item: IPassportRef) {
    const { passportAddress: passportAddressOriginal, blockNumber } = item;
    const passportAddress = getShortId(passportAddressOriginal);

    const url = createRouteUrl(this.props.location, `${routes.Passport}/${passportAddressOriginal}`, {
      start_block: new BigNumber(blockNumber).toString(10),
    });

    return (
      <Link to={url}>
        {passportAddress}
      </Link>
    );
  }

  private renderBlockNumber(item: IPassportRef) {
    const { blockNumber } = item;

    const decBlockNr = new BigNumber(blockNumber, 16).toString(10);

    const url = getEtherscanUrl();
    if (!url) {
      return decBlockNr;
    }

    return (
      <a
        href={`${url}/block/${decBlockNr}`}
        target='_blank'
      >
        <Share />
        {decBlockNr}
      </a>
    );
  }

  private renderTxHash(item: IPassportRef) {
    const { txHash: txHashOriginal } = item;
    const txHash = getShortId(txHashOriginal);

    const url = getEtherscanUrl();
    if (!url) {
      return txHash;
    }

    return (
      <a
        href={`${url}/tx/${txHashOriginal}`}
        target='_blank'
      >
        <Share />
        {txHash}
      </a>
    );
  }
}

// #endregion

const routed = withRouter(PassportList);
export { routed as PassportList };
