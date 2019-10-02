import { AsyncState, IAsyncState } from 'src/core/redux/asyncAction';
import { createReducer, ReducerBuilder } from 'src/core/redux/ReducerBuilder';
import { Address, IFactProviderInfo } from 'verifiable-data';
import { IProposeDataExchangeResult } from 'verifiable-data/dist/lib/passport/PrivateDataExchanger';
import { getFacts, getPassportInformation, getPassports, IPassportInformation, loadFactProviderInfo, loadFactValue, proposeDataExchange } from './actions';
import { IFactList, IFactValueWrapper, IPassportList } from './models';

// #region -------------- State -------------------------------------------------------------------

export interface IPassportState {

  /**
   * List of passports for passport factory
   */
  list: IAsyncState<IPassportList>;

  /**
   * List of facts for passport
   */
  facts: IAsyncState<IFactList>;

  /**
   * Fact values
   */
  factValues: { [txHash: string]: IAsyncState<IFactValueWrapper> };

  /**
   * Passport information - owner, pending owner, passport logic registry
   */
  passportInformation: IAsyncState<IPassportInformation>;

  /**
   * Data proposal statuses, indexed by canonical fact keys
   */
  exchangeProposal: { [canonicalFactKey: string]: IAsyncState<IProposeDataExchangeResult> };

  /**
   * Fact provider informations
   */
  factProviderInfos: { [address: string]: IAsyncState<IFactProviderInfo, any> };
}

const initialState: IPassportState = {
  list: new AsyncState(),
  facts: new AsyncState(),
  factValues: {},
  passportInformation: new AsyncState(),
  exchangeProposal: {},
  factProviderInfos: {},
};

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

const builder = new ReducerBuilder<IPassportState>()
  .addAsync(getPassports, s => s.list)
  .addAsync(getFacts, s => s.facts)
  .addAsync(loadFactValue, s => s.factValues, a => [a.fact.transactionHash])
  .addAsync(getPassportInformation, s => s.passportInformation)
  .addAsync(proposeDataExchange, s => s.exchangeProposal, a =>
    [getCanonicalFactKey(a.factValue.passportAddress, a.factValue.factProviderAddress, a.factValue.key)])
  .addAsync(loadFactProviderInfo, e => e.factProviderInfos, a => [a]);

export const passportReducer = createReducer(initialState, builder);

// #endregion

// #region -------------- Utils -------------------------------------------------------------------

export function getCanonicalFactKey(passportAddress: Address, factProviderAddress: Address, factKey: string) {
  return `${passportAddress.toLowerCase()}_${factProviderAddress.toLowerCase()}_${factKey}`;
}

// #endregion
