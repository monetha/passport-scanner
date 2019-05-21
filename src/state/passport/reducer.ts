import { IAsyncState, AsyncState } from 'src/core/redux/asyncAction';
import { IPassportList, IFactList, IFactValueWrapper } from './models';
import { ReducerBuilder, createReducer } from 'src/core/redux/ReducerBuilder';
import { getPassports, getFacts, loadFactValue } from './actions';

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
}

const initialState: IPassportState = {
  list: new AsyncState(),
  facts: new AsyncState(),
  factValues: {},
};

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

const builder = new ReducerBuilder<IPassportState>()
  .addAsync(getPassports, s => s.list)
  .addAsync(getFacts, s => s.facts)
  .addAsync(loadFactValue, s => s.factValues, a => [a.fact.transactionHash]);

export const passportReducer = createReducer(initialState, builder);

// #endregion
