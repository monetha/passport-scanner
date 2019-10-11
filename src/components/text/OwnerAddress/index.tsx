import React from 'react';
import './style.scss';
import { Share } from 'src/components/indicators/Share';
import { getEtherscanUrl, getShortId } from 'src/helpers';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  ownerAddressOriginal: string;
  shorten?: boolean;
  title?: string;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class OwnerAddress extends React.PureComponent<IProps> {
  public render() {
    const { ownerAddressOriginal, shorten, title } = this.props;
    let ownerAddress = ownerAddressOriginal;
    if (shorten) {
      ownerAddress =  getShortId(ownerAddressOriginal);
    }

    const url = getEtherscanUrl();
    if (!url) {
      return title || ownerAddress;
    }

    return (
      <a
        href={`${url}/address/${ownerAddressOriginal}`}
        target='_blank'
      >
        <Share />
        {title || ownerAddress}
      </a>
    );
  }
}

// #endregion
