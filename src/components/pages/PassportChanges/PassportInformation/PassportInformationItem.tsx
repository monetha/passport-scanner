import React from 'react';
import { OwnerAddress } from 'src/components/OwnerAddress';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  title: string;
  address: string;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class PassportInformationItem extends React.PureComponent<IProps> {
  public render() {
    return (
      <div>
        <span className='title'>{this.props.title}</span>
        <div className='full-address'>
          {this.props.address ? <OwnerAddress ownerAddressOriginal={this.props.address} /> : '–'}
        </div>
        <div className='shorten-address'>
          {this.props.address ? <OwnerAddress ownerAddressOriginal={this.props.address} shorten={true} /> : '–'}
        </div>
      </div>
    );
  }
}

// #endregion
