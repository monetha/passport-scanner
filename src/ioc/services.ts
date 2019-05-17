import { Store } from 'redux';
import { IState } from 'src/state/rootReducer';
import { ILoggingService } from 'src/core/logging/ILoggingService';
import { ErrorHandler } from 'src/core/error/ErrorHandler';

let registeredServices: IServices = null;

export interface IServices {
  reduxStore: Store<IState>;
  logger: ILoggingService;
  createErrorHandler: (error: Error) => ErrorHandler;
  web3: any;
  ethNetworkUrl: string;
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
