import { getActionNameCreator } from 'src/core/redux/action';
import { createAsyncAction } from 'src/core/redux/asyncAction';
import { IPassportList, IFactList } from './models';

// #region -------------- Action types -------------------------------------------------------------------

const get = getActionNameCreator('passport');

export const actionTypes = {
  getPassports: get('GET_PASSPORTS'),
  getFacts: get('GET_FACTS'),
};

// #endregion

// #region -------------- Passport list -------------------------------------------------------------------

export interface IGetPassportsPayload {
  factoryAddress: string;
  startBlock: number;
}

export const getPassports = createAsyncAction<IGetPassportsPayload, IPassportList>(actionTypes.getPassports);

// #endregion

// #region -------------- Facts -------------------------------------------------------------------

export interface IGetFactsPayload {
  passportAddress: string;
  startBlock: number;
}

export const getFacts = createAsyncAction<IGetFactsPayload, IFactList>(actionTypes.getFacts);

// #endregion
