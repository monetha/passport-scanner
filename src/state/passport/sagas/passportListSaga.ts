import { put, takeLatest } from 'redux-saga/effects';
import { IAsyncAction } from 'src/core/redux/asyncAction';
import { getServices } from 'src/ioc/services';
import { getPassports, IGetPassportsPayload } from '../actions';
import { IPassportList } from '../models';
import sdk, { IPassportRef } from 'reputation-sdk';
import { BigNumber } from 'bignumber.js';
import orderBy from 'lodash/orderBy';

// #region -------------- Challenge lists retrieval -------------------------------------------------------------------

function* onGetPassports(action: IAsyncAction<IGetPassportsPayload>) {
  try {
    const { factoryAddress, startBlock } = action.payload;

    const { web3, ethNetworkUrl } = getServices();

    let startBlockHex;
    if (startBlock) {
      startBlockHex = `0x${new BigNumber(startBlock, 10).toString(16)}`;
    }

    const reader = new sdk.PassportReader(web3, ethNetworkUrl);
    const passportRefs: IPassportRef[] = yield reader.getPassportsList(factoryAddress, startBlockHex);

    const sortedPassportRefs = orderBy(passportRefs, ['blockNumber'], ['desc']);

    const passportList: IPassportList = {
      factoryAddress,
      startBlock,
      passportRefs: sortedPassportRefs,
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
