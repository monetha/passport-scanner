import { put, takeLatest } from 'redux-saga/effects';
import { IAsyncAction } from 'src/core/redux/asyncAction';
import { getServices } from 'src/ioc/services';
import { getPassports, IGetPassportsPayload } from '../actions';
import { IPassportList } from '../models';
import { IPassportRef, PassportReader } from 'verifiable-data';
import { BigNumber } from 'bignumber.js';
import reverse from 'lodash/reverse';

// #region -------------- Challenge lists retrieval -------------------------------------------------------------------

function* onGetPassports(action: IAsyncAction<IGetPassportsPayload>) {
  try {
    const { factoryAddress, startBlock } = action.payload;

    const { web3 } = getServices();

    let startBlockHex;
    if (startBlock) {
      startBlockHex = `0x${new BigNumber(startBlock, 10).toString(16)}`;
    }

    const reader = new PassportReader(web3);
    const passportRefs: IPassportRef[] = yield reader.getPassportsList(factoryAddress, startBlockHex);

    const sortedPassportRefs = reverse(passportRefs);

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
