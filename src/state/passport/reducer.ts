import { IAsyncState, AsyncState } from 'src/core/redux/asyncAction';
import { IPassportList, IFactList } from './models';
import { ReducerBuilder, createReducer } from 'src/core/redux/ReducerBuilder';
import { getPassports, getFacts } from './actions';

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
}

const initialState: IPassportState = {
  list: new AsyncState(),
  facts: new AsyncState(),
};

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

const builder = new ReducerBuilder<IPassportState>()
  .addAsync(getPassports, s => s.list)
  .addAsync(getFacts, s => s.facts);

export const passportReducer = createReducer(initialState, builder);

// #endregion
