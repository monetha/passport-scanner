import { combineReducers } from 'redux';
import { IAppState, appReducer } from './app/reducer';
import { RouterState, connectRouter } from 'connected-react-router';
import { passportReducer, IPassportState } from './passport/reducer';

// #region -------------- Store interface -------------------------------------------------------------------

export interface IState {
  router: RouterState;
  app: IAppState;
  passport: IPassportState;
}

// #endregion

// #region -------------- Root reducer -------------------------------------------------------------------

export const createRootReducer = (history) => combineReducers<IState>({
  router: connectRouter(history),
  app: appReducer,
  passport: passportReducer,
});

// #endregion
