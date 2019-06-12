import React from 'react';
import './style.scss';
import { translate } from 'src/i18n';
import { OwnerAddress } from 'src/components/OwnerAddress';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  passportOwnerAddress: string;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class PassportOwnedBy extends React.PureComponent<IProps> {
  public render() {
    return (
      <div className='passport-owned-by'>
        <h2>{translate(t => t.passport.passport)}</h2>
        <span className='owned-by'>{translate(t => t.passport.ownedBy)}</span>
        <div className='full-address'>
          <OwnerAddress ownerAddressOriginal={this.props.passportOwnerAddress} />
        </div>
        <div className='shorten-address'>
          <OwnerAddress ownerAddressOriginal={this.props.passportOwnerAddress} shorten={true} />
        </div>
      </div>
    );
  }
}

// #endregion
