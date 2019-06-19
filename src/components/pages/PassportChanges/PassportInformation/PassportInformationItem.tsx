import React from 'react';
import { OwnerAddress } from 'src/components/OwnerAddress';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  title: string;
  address: string;
}

// #endregion

const genesisAccount = '0x0000000000000000000000000000000000000000';

// #region -------------- Component ---------------------------------------------------------------

export class PassportInformationItem extends React.PureComponent<IProps> {
  public render() {
    return (
      <div className='passport-information-item'>
        <div className='title'>{this.props.title}</div>
        <div className='full-address'>
          {this.props.address !== genesisAccount ? <OwnerAddress ownerAddressOriginal={this.props.address} /> : '–'}
        </div>
        <div className='shorten-address'>
          {this.props.address !== genesisAccount ? <OwnerAddress ownerAddressOriginal={this.props.address} shorten={true} /> : '–'}
        </div>
      </div>
    );
  }
}

// #endregion
