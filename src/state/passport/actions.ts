import { getActionNameCreator } from 'src/core/redux/action';
import { createAsyncAction } from 'src/core/redux/asyncAction';
import { IPassportList, IFactList, IFactValueWrapper } from './models';
import { IFact } from 'src/models/passport';

// #region -------------- Action types -------------------------------------------------------------------

const get = getActionNameCreator('passport');

export const actionTypes = {
  getPassports: get('GET_PASSPORTS'),
  getFacts: get('GET_FACTS'),
  loadFactValue: get('LOAD_FACT_VALUE'),
  getPassportOwner: get('GET_PASSPORT_OWNER'),
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
  factProviderAddress: string;
}

export const getFacts = createAsyncAction<IGetFactsPayload, IFactList>(actionTypes.getFacts);

export interface ILoadFactPayload {
  passportAddress: string;
  fact: IFact;
}

export const loadFactValue = createAsyncAction<ILoadFactPayload, IFactValueWrapper>(actionTypes.loadFactValue);

export interface IGetPassportOwnerPayload {
  passportAddress: string;
}

export const getPassportOwner = createAsyncAction<IGetPassportOwnerPayload, string>(actionTypes.getPassportOwner);

// #endregion
