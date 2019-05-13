import { Store } from 'redux';
import { connectivityErrorCodeExtractor } from 'src/core/error/errorCodeExtractors/connectivityErrorCodeExtractor';
import { ErrorHandler } from 'src/core/error/ErrorHandler';
import { LoggingService } from 'src/core/logging/ConsoleLoggingService';
import { ILoggingService } from 'src/core/logging/ILoggingService';
import { IState } from 'src/state/rootReducer';
import { IServices, registerServices } from './services';

export const bootstrapIOC = (store: Store<IState>) => {
  const services: Partial<IServices> = {};

  services.reduxStore = store;
  services.logger = new LoggingService();
  services.createErrorHandler = errorHandlerCreatorFactory(services.logger);

  registerServices(services as IServices);
};

const errorHandlerCreatorFactory = (logger: ILoggingService) => (
  (error: Error) => {
    return new ErrorHandler(error, logger)
      .addErrorCodeExtractor(connectivityErrorCodeExtractor);
  }
);
