import { Store } from 'redux';
import { IState } from 'src/state/rootReducer';
import { ILoggingService } from 'src/core/logging/ILoggingService';
import { ErrorHandler } from 'src/core/error/ErrorHandler';
import Web3 from 'web3';
import { Address } from 'verifiable-data';

let registeredServices: IServices = null;

export interface IServices {
  reduxStore: Store<IState>;
  logger: ILoggingService;
  createErrorHandler: (error: Error) => ErrorHandler;
  web3: Web3;
  allEthNetworks: INetworkInfo[];
  ethNetwork: INetworkInfo;
}

export interface INetworkInfo {
  url: string;
  name: string;
  alias?: string;
  etherscanUrl?: string;
  passportFactory?: Address;
  factProviderRegistry?: Address;
}

/**
 * Registers given services as IoC container
 */
export const registerServices = (services: IServices) => {
  registeredServices = services;
};

/**
 * Gets IoC services container
 */
export const getServices = (): IServices => {
  return registeredServices;
};
