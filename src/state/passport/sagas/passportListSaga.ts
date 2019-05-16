import { put, takeLatest } from 'redux-saga/effects';
import { getPassports, IGetPassportsPayload } from '../actions';
import { IAsyncAction } from 'src/core/redux/asyncAction';
import { getServices } from 'src/ioc/services';
import { IPassportList } from '../models';

// #region -------------- Challenge lists retrieval -------------------------------------------------------------------

function* onGetPassports(action: IAsyncAction<IGetPassportsPayload>) {
  try {
    const { factoryAddress, startBlock } = action.payload;
    // const challengesApi = getServices();

    const passportList: IPassportList = {
      factoryAddress,
      startBlock,
      passportRefs: []
    };

    yield put(getPassports.success(passportList));
  } catch (error) {
    yield getServices().createErrorHandler(error)
      .onAnyError(function* (friendlyError) {
        yield put(getPassports.failure(friendlyError));
      })
      .process();
  }
}

// #endregion

export const passportListSaga = [
  takeLatest(getPassports.request.type, onGetPassports),
];
