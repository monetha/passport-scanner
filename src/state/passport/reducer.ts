import { IAsyncState, AsyncState } from 'src/core/redux/asyncAction';
import { IPassportList, IFactList, IFactValueWrapper } from './models';
import { ReducerBuilder, createReducer } from 'src/core/redux/ReducerBuilder';
import { getPassports, getFacts, loadFactValue, getPassportInformation, IPassportInformation, proposeDataExchange } from './actions';
import { IProposeDataExchangeResult } from 'verifiable-data/dist/lib/passport/PrivateDataExchanger';
import { Address } from 'verifiable-data';

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
}

const initialState: IPassportState = {
  list: new AsyncState(),
  facts: new AsyncState(),
  factValues: {},
  passportInformation: new AsyncState(),
  exchangeProposal: {},
};

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

const builder = new ReducerBuilder<IPassportState>()
  .addAsync(getPassports, s => s.list)
  .addAsync(getFacts, s => s.facts)
  .addAsync(loadFactValue, s => s.factValues, a => [a.fact.transactionHash])
  .addAsync(getPassportInformation, s => s.passportInformation)
  .addAsync(proposeDataExchange, s => s.exchangeProposal);

export const passportReducer = createReducer(initialState, builder);

// #endregion

// #region -------------- Utils -------------------------------------------------------------------

export function getCanonicalFactKey(passportAddress: Address, factProviderAddress: Address, factKey: string) {
  return `${passportAddress.toLowerCase()}_${factProviderAddress.toLowerCase()}_${factKey}`;
}

// #endregion
