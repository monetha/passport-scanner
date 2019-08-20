import { put } from 'redux-saga/effects';
import { IAsyncAction } from 'src/core/redux/asyncAction';
import { takeEveryLatest } from 'src/core/redux/saga';
import { getServices } from 'src/ioc/services';
import { PrivateDataExchanger } from 'verifiable-data';
import { IProposeDataExchangePayload, proposeDataExchange } from '../actions';
import { getCanonicalFactKey } from '../reducer';
import { enableWallet, getCurrentAccountAddress } from 'src/utils/walletProvider';
import { createFriendlyError } from 'src/core/error/FriendlyError';
import { ErrorCode } from 'src/core/error/ErrorCode';
import { translate } from 'src/i18n';
import { sendAndWaitTx } from 'src/utils/tx';

// #region -------------- Fact value retrieval -------------------------------------------------------------------

function* onProposeExchange(action: IAsyncAction<IProposeDataExchangePayload>) {
  try {
    const { web3 } = getServices();
    const { passportAddress, factProviderAddress, key } = action.payload.factValue;
    const { stake } = action.payload;

    const exchanger = new PrivateDataExchanger(web3, passportAddress);

    yield enableWallet();

    const requesterAddress = yield getCurrentAccountAddress();
    if (!requesterAddress) {
      throw createFriendlyError(ErrorCode.NO_ADDRESS_IN_WALLET, translate(t => t.errors.noAddressInWallet));
    }

    // TODO: Check if network matches

    const result = yield exchanger.propose(key, factProviderAddress, stake, requesterAddress, sendAndWaitTx);

    yield put(proposeDataExchange.success(result, action.subpath));

  } catch (error) {
    yield getServices().createErrorHandler(error)
      .onAnyError(function* (friendlyError) {
        yield put(proposeDataExchange.failure(friendlyError, action.payload, action.subpath));
      })
      .process();
  }
}

// #endregion

export const exchangeSaga = [
  takeEveryLatest<IAsyncAction<IProposeDataExchangePayload>, any>(
    proposeDataExchange.request.type,
    a => {
      const { factProviderAddress, passportAddress, key } = a.payload.factValue;

      const canonicalFactKey = getCanonicalFactKey(passportAddress, factProviderAddress, key);

      return `${a.type}_${canonicalFactKey}`;
    }, onProposeExchange),
];
