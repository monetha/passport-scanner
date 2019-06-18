import React from 'react';
import './style.scss';
import { translate } from 'src/i18n';
import { OwnerAddress } from 'src/components/OwnerAddress';
import { IPassportInformation } from 'src/state/passport/actions';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  passportInformation: IPassportInformation;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class PassportInformation extends React.PureComponent<IProps> {
  public render() {
    if (!this.props.passportInformation) {
      return null;
    }

    return (
      <div className='passport-owned-by'>
        <h2>{translate(t => t.passport.passport)}</h2>
        <span className='owned-by'>{translate(t => t.passport.ownedBy)}</span>
        <div className='full-address'>
          <OwnerAddress ownerAddressOriginal={this.props.passportInformation.passportOwnerAddress}/>
        </div>
        <div className='shorten-address'>
          <OwnerAddress ownerAddressOriginal={this.props.passportInformation.passportOwnerAddress} shorten={true}/>
        </div>
      </div>
    );
  }
}

// #endregion
