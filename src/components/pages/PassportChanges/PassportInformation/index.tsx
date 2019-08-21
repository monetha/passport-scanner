import React from 'react';
import './style.scss';
import { translate } from 'src/i18n';
import { PassportInformationItem } from './PassportInformationItem';
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
      <div className='mh-passport-owned-by'>
        <h2>{translate(t => t.passport.passport)}</h2>
        <PassportInformationItem
          title={translate(t => t.passport.ownedBy)}
          address={this.props.passportInformation.passportOwnerAddress}
        />
        <PassportInformationItem
          title={translate(t => t.passport.pendingOwner)}
          address={this.props.passportInformation.passportPendingOwnerAddress}
        />
        <PassportInformationItem
          title={translate(t => t.passport.passportLogicRegistry)}
          address={this.props.passportInformation.passportLogicRegistryAddress}
        />
      </div>
    );
  }
}

// #endregion
