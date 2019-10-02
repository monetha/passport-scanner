import { put, takeEvery } from 'redux-saga/effects';
import { FactProviderManager, IFactProviderInfo } from 'verifiable-data';
import { loadFactProviderInfo } from '../actions';
import { IAsyncAction } from 'src/core/redux/asyncAction';
import { getServices } from 'src/ioc/services';

// #region -------------- Load fact provider info -------------------------------------------------------------------

function* onLoadFactProviderInfo(action: IAsyncAction<string>) {
  try {
    const fpAddress = action.payload;

    const { web3, ethNetwork } = getServices();

    if (!ethNetwork.factProviderRegistry) {
      yield put(loadFactProviderInfo.success(null, action.subpath));
      return;
    }

    const manager = new FactProviderManager(web3, ethNetwork.factProviderRegistry);
    const info: IFactProviderInfo = yield manager.getInfo(fpAddress);

    yield put(loadFactProviderInfo.success(info, action.subpath));
  } catch (error) {
    yield getServices().createErrorHandler(error)
      .onAnyError(function* (friendlyError) {
        yield put(loadFactProviderInfo.failure(friendlyError, action.payload, action.subpath));
      })
      .process();
  }
}

// #endregion

export const factProviderLoadSagas = [
  takeEvery(loadFactProviderInfo.request.type, onLoadFactProviderInfo),
];
