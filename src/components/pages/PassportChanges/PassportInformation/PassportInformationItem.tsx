import React, { Fragment } from 'react';
import { OwnerAddress } from 'src/components/text/OwnerAddress';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  title: string;
  address?: string;
  addressTitle?: string;
  value?: React.ReactNode;
}

// #endregion

const genesisAccount = '0x0000000000000000000000000000000000000000';

// #region -------------- Component ---------------------------------------------------------------

export class PassportInformationItem extends React.PureComponent<IProps> {
  public render() {
    const { address, addressTitle, value, title } = this.props;

    return (
      <div className='mh-passport-information-item'>
        <div className='mh-title'>{title}</div>

        {address ? (
          <Fragment>
            <div className='mh-full-address'>
              {address !== genesisAccount ? <OwnerAddress ownerAddressOriginal={address} title={addressTitle} /> : '–'}
            </div>
            <div className='mh-shorten-address'>
              {address !== genesisAccount ? <OwnerAddress ownerAddressOriginal={address} title={addressTitle} shorten={true} /> : '–'}
            </div>
          </Fragment>
        ) : (
            <div className='mh-value'>
              {value}
            </div>
          )}
      </div>
    );
  }
}

// #endregion
