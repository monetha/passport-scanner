import { getServices } from 'src/ioc/services';
import { etherscanUrls, ethNetworkUrls } from 'src/constants/api';

export const getShortId = walletAddress => {
  if (!walletAddress) {
    return null;
  }

  const startStr = walletAddress.substr(0, 16);
  const endStr = walletAddress.substring(walletAddress.length - 6);

  return `${startStr}...${endStr}`;
};

export const getEtherscanUrl = () => {
  const { ethNetworkUrl } = getServices();

  switch (ethNetworkUrl) {
    case ethNetworkUrls.ropsten:
      return etherscanUrls.ropsten;

    case ethNetworkUrls.mainnet:
      return etherscanUrls.mainnet;

    default:
      return null;
  }
};
