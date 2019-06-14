import React from 'react';
import './style.scss';
import { Share } from 'src/components/pages/PassportChanges/Share';
import { getEtherscanUrl, getShortId } from 'src/helpers';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  ownerAddressOriginal: string;
  shorten?: boolean;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class OwnerAddress extends React.PureComponent<IProps> {
  public render() {
    const { ownerAddressOriginal, shorten } = this.props;
    let ownerAddress = ownerAddressOriginal;
    if (shorten) {
      ownerAddress =  getShortId(ownerAddressOriginal);
    }

    const url = getEtherscanUrl();
    if (!url) {
      return ownerAddress;
    }

    return (
      <a
        href={`${url}/address/${ownerAddressOriginal}`}
        target='_blank'
      >
        <Share />
        {ownerAddress}
      </a>
    );
  }
}

// #endregion
