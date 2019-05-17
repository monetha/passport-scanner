import React, { Fragment } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { IPassportRef } from 'src/models/passport';
import './style.scss';
import { translate } from 'src/i18n';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps{
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
        <Td>{item.passportAddress}</Td>
        <Td>{item.ownerAddress}</Td>
        <Td>{item.blockNumber}</Td>
        <Td>{item.blockHash}</Td>
      </Tr>
    );
  }
}

// #endregion
