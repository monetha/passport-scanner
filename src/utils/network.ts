import { getServices } from 'src/ioc/services';
import { ethNetworkUrls } from 'src/constants/api';
import { translate } from 'src/i18n';

export function getSelectedNetworkInfo() {
  const { ethNetworkUrl } = getServices();

  switch (ethNetworkUrl) {
    case ethNetworkUrls.mainnet:
      return {
        url: ethNetworkUrl,
        name: translate(t => t.ethereum.mainnet),
        alias: 'mainnet',
      };

    case ethNetworkUrls.ropsten:
      return {
        url: ethNetworkUrl,
        name: translate(t => t.ethereum.ropsten),
        alias: 'ropsten',
      };

    default:
      return {
        url: ethNetworkUrl,
        name: ethNetworkUrl,
      };
  }
}
