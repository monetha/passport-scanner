import { IAsyncState, AsyncState } from 'src/core/redux/asyncAction';
import { IPassportList } from './models';
import { ReducerBuilder, createReducer } from 'src/core/redux/ReducerBuilder';
import { getPassports } from './actions';

// #region -------------- State -------------------------------------------------------------------

export interface IPassportState {

  /**
   * List of passports for fact provider
   */
  list: IAsyncState<IPassportList>;
}

const initialState: IPassportState = {
  list: new AsyncState(),
};

// #endregion

// #region -------------- Reducer -------------------------------------------------------------------

const builder = new ReducerBuilder<IPassportState>()
  .addAsync(getPassports, s => s.list);

export const passportReducer = createReducer(initialState, builder);

// #endregion
