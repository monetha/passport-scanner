import { INetworkInfo } from 'src/ioc/services';
import { createFriendlyError } from 'src/core/error/FriendlyError';
import { ErrorCode } from 'src/core/error/ErrorCode';
import { translate } from 'src/i18n';

export function parseNetworkConfig(): INetworkInfo[] {
  const networks: INetworkInfo[] = require('../../../networks.default.json').networks;

  if (!networks) {
    throw createFriendlyError(ErrorCode.INVALID_NETWORK_CONFIG, translate(t => t.errors.invalidNetworkConfig));
  }

  if (networks.length === 0) {
    throw createFriendlyError(ErrorCode.INVALID_NETWORK_CONFIG, 'Network config should have at least one network entry');
  }

  for (let i = 0; i < networks.length; i += 1) {
    const network = networks[i];

    if (!network) {
      throw createFriendlyError(ErrorCode.INVALID_NETWORK_CONFIG, `Network config entry ${i} cannot be empty`);
    }

    if (!network.url) {
      throw createFriendlyError(ErrorCode.INVALID_NETWORK_CONFIG, `Network config entry ${i} does not have 'url'`);
    }

    if (!network.name) {
      throw createFriendlyError(ErrorCode.INVALID_NETWORK_CONFIG, `Network config entry ${i} does not have 'name'`);
    }
  }

  return networks;
}
