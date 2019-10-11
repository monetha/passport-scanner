import { getActionNameCreator } from 'src/core/redux/action';
import { createAsyncAction } from 'src/core/redux/asyncAction';
import { IPassportList, IFactList, IFactValueWrapper } from './models';
import { IHistoryEvent, IFactValue, IFactProviderInfo } from 'verifiable-data';
import { IProposeDataExchangeResult } from 'verifiable-data/dist/lib/passport/PrivateDataExchanger';
import { IPrivateDataHashes } from 'verifiable-data/dist/lib/passport/FactReader';
import BN from 'bn.js';

// #region -------------- Action types -------------------------------------------------------------------

const get = getActionNameCreator('passport');

export const actionTypes = {
  getPassports: get('GET_PASSPORTS'),
  getFacts: get('GET_FACTS'),
  loadFactValue: get('LOAD_FACT_VALUE'),
  getPassportInformation: get('GET_PASSPORT_INFORMATION'),
  proposeDataExchange: get('PROPOSE_DATA_EXCHANGE'),
  loadFactProviderInfo: get('LOAD_FACT_PROVIDER_INFO'),
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
  fact: IHistoryEvent;
}

export const loadFactValue = createAsyncAction<ILoadFactPayload, IFactValueWrapper>(actionTypes.loadFactValue);

export interface IGetPassportOwnerPayload {
  passportAddress: string;
}

export interface IPassportInformation {
  passportOwnerAddress: string;
  passportPendingOwnerAddress: string;
  passportLogicRegistryAddress: string;
}

export const getPassportInformation = createAsyncAction<IGetPassportOwnerPayload, IPassportInformation>(actionTypes.getPassportInformation);

// #endregion

// #region -------------- Exchange -------------------------------------------------------------------

export interface IProposeDataExchangePayload {
  factValue: IFactValue<IPrivateDataHashes>;
  stake: BN;
}

export const proposeDataExchange = createAsyncAction<IProposeDataExchangePayload, IProposeDataExchangeResult>(actionTypes.proposeDataExchange);

// #endregion

// #region -------------- Fact provider infos -------------------------------------------------------------------

export const loadFactProviderInfo = createAsyncAction<string, IFactProviderInfo>(actionTypes.loadFactProviderInfo);

// #endregion
