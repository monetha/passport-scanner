import { getServices } from 'src/ioc/services';

export const getShortId = walletAddress => {
  if (!walletAddress) {
    return null;
  }

  const startStr = walletAddress.substr(0, 16);
  const endStr = walletAddress.substring(walletAddress.length - 6);

  return `${startStr}...${endStr}`;
};

export const getEtherscanUrl = () => {
  const { ethNetwork } = getServices();

  return ethNetwork.etherscanUrl;
};
