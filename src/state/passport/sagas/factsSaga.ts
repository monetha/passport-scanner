import { BigNumber } from 'bignumber.js';
import { put, takeLatest } from 'redux-saga/effects';
import { FactHistoryReader, PassportReader } from 'reputation-sdk';
import { DataType, IHistoryEvent } from 'reputation-sdk/dist/lib/models/IHistoryEvent';
import { ErrorCode } from 'src/core/error/ErrorCode';
import { createFriendlyError } from 'src/core/error/FriendlyError';
import { IPFSPathReaderClient } from 'src/core/ipfs/IPFSPathReaderClient';
import { IAsyncAction } from 'src/core/redux/asyncAction';
import { takeEveryLatest } from 'src/core/redux/saga';
import { getServices } from 'src/ioc/services';
import { getFacts, IGetFactsPayload, ILoadFactPayload, loadFactValue } from '../actions';
import { IFactList } from '../models';

// #region -------------- Facts retreival -------------------------------------------------------------------

function* onGetFacts(action: IAsyncAction<IGetFactsPayload>) {
  try {
    const { passportAddress, startBlock, factProviderAddress } = action.payload;

    const { web3, ethNetworkUrl } = getServices();

    let startBlockHex;
    if (startBlock) {
      startBlockHex = `0x${new BigNumber(startBlock).toString(16)}`;
    }

    const reader = new PassportReader(web3, ethNetworkUrl);
    const facts: IHistoryEvent[] = yield reader.readPassportHistory(passportAddress, {
      startBlock: startBlockHex,
      factProviderAddress: factProviderAddress || undefined,
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

// #region -------------- Fact value retrieval -------------------------------------------------------------------

function* onLoadFactValue(action: IAsyncAction<ILoadFactPayload>) {
  try {
    const { web3 } = getServices();

    const reader = new FactHistoryReader(web3);

    const { dataType, transactionHash } = action.payload.fact;

    let factValue;

    switch (dataType) {
      case DataType.Address:
        factValue = yield reader.getAddress(transactionHash);
        break;

      case DataType.Bool:
        factValue = yield reader.getBool(transactionHash);
        break;

      case DataType.Bytes:
        factValue = yield reader.getBytes(transactionHash);
        break;

      case DataType.IPFSHash:
        factValue = yield reader.getIPFSData(transactionHash, new IPFSPathReaderClient());
        break;

      case DataType.Int:
        factValue = yield reader.getInt(transactionHash);
        break;

      case DataType.String:
        factValue = yield reader.getString(transactionHash);
        break;

      case DataType.TxData:
        factValue = yield reader.getTxdata(transactionHash);
        break;

      case DataType.Uint:
        factValue = yield reader.getUint(transactionHash);
        break;

      default:
        throw createFriendlyError(ErrorCode.NOT_SUPPORTED, `Fact type "${dataType}" `);
    }

    yield put(loadFactValue.success({
      dataType,
      value: factValue,
    }, action.subpath));

  } catch (error) {
    yield getServices().createErrorHandler(error)
      .onAnyError(function* (friendlyError) {
        yield put(loadFactValue.failure(friendlyError, action.payload, action.subpath));
      })
      .process();
  }
}

// #endregion

export const factsSaga = [
  takeLatest(getFacts.request.type, onGetFacts),
  takeEveryLatest<IAsyncAction<ILoadFactPayload>, any>(
    loadFactValue.request.type, a => `${a.type}_${a.payload.fact.transactionHash}`, onLoadFactValue),
];
