import { BigNumber } from 'bignumber.js';
import { put, takeLatest } from 'redux-saga/effects';
import sdk from 'reputation-sdk';
import { IHistoryEvent } from 'reputation-sdk/dist/lib/models/IHistoryEvent';
import { IAsyncAction } from 'src/core/redux/asyncAction';
import { getServices } from 'src/ioc/services';
import { getFacts, IGetFactsPayload } from '../actions';
import { IFactList } from '../models';

// #region -------------- Challenge lists retrieval -------------------------------------------------------------------

function* onGetFacts(action: IAsyncAction<IGetFactsPayload>) {
  try {
    const { passportAddress, startBlock } = action.payload;

    const { web3, ethNetworkUrl } = getServices();

    let startBlockHex;
    if (startBlock) {
      startBlockHex = `0x${new BigNumber(startBlock).toString(16)}`;
    }

    const reader = new sdk.PassportReader(web3, ethNetworkUrl);
    const facts: IHistoryEvent[] = yield reader.readPassportHistory(passportAddress, {
      startBlock: startBlockHex,
    });

    const factList: IFactList = {
      passportAddress,
      startBlock,
      facts,
    };

    yield put(getFacts.success(factList));
  } catch (error) {
    yield getServices().createErrorHandler(error)
      .onAnyError(function* (friendlyError) {
        yield put(getFacts.failure(friendlyError));
      })
      .process();
  }
}

// #endregion

export const factsSaga = [
  takeLatest(getFacts.request.type, onGetFacts),
];
