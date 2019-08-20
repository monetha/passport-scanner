import React from 'react';
import { OwnerAddress } from 'src/components/text/OwnerAddress';

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
      <div className='mh-passport-information-item'>
        <div className='mh-title'>{this.props.title}</div>
        <div className='mh-full-address'>
          {this.props.address !== genesisAccount ? <OwnerAddress ownerAddressOriginal={this.props.address} /> : '–'}
        </div>
        <div className='mh-shorten-address'>
          {this.props.address !== genesisAccount ? <OwnerAddress ownerAddressOriginal={this.props.address} shorten={true} /> : '–'}
        </div>
      </div>
    );
  }
}

// #endregion
