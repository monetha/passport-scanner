import { BigNumber } from 'bignumber.js';
import { put, takeLatest } from 'redux-saga/effects';
import { FactHistoryReader, PassportReader, PassportOwnership } from 'reputation-sdk';
import { DataType, IHistoryEvent } from 'reputation-sdk/dist/lib/models/IHistoryEvent';
import { ErrorCode } from 'src/core/error/ErrorCode';
import { createFriendlyError } from 'src/core/error/FriendlyError';
import { IPFSPathReaderClient } from 'src/core/ipfs/IPFSPathReaderClient';
import { IAsyncAction } from 'src/core/redux/asyncAction';
import { takeEveryLatest } from 'src/core/redux/saga';
import { getServices } from 'src/ioc/services';
import { getFacts, IGetFactsPayload, ILoadFactPayload, loadFactValue, getPassportInformation, IGetPassportOwnerPayload } from '../actions';
import { IFactList } from '../models';
import reverse from 'lodash/reverse';

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

    const sortedFacts = reverse(facts);

    const factList: IFactList = {
      passportAddress,
      startBlock,
      facts: sortedFacts,
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

function* onGetPassportInformation(action: IAsyncAction<IGetPassportOwnerPayload>) {
  try {
    const { passportAddress } = action.payload;

    const { web3, ethNetworkUrl } = getServices();

    const passportOwnership = new PassportOwnership(web3, passportAddress);
    const reader = new PassportReader(web3, ethNetworkUrl);

    const passportOwnerAddress: string = yield passportOwnership.getOwnerAddress();
    const passportPendingOwnerAddress: string = yield passportOwnership.getPendingOwnerAddress();
    const passportLogicRegistryAddress: string = yield reader.getPassportLogicRegistryAddress(passportAddress);

    yield put(getPassportInformation.success({
      passportOwnerAddress,
      passportPendingOwnerAddress,
      passportLogicRegistryAddress,
    }));

  } catch (error) {
    yield getServices().createErrorHandler(error)
      .onAnyError(function* (friendlyError) {
        yield put(getPassportInformation.failure(friendlyError));
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

        if (Buffer.isBuffer(factValue.value)) {
          factValue.value = factValue.value.toString('utf8');
        }
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
  takeLatest(getPassportInformation.request.type, onGetPassportInformation),
  takeEveryLatest<IAsyncAction<ILoadFactPayload>, any>(
    loadFactValue.request.type, a => `${a.type}_${a.payload.fact.transactionHash}`, onLoadFactValue),
];
