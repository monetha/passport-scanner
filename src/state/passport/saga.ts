import { passportListSaga } from './sagas/passportListSaga';
import { factsSaga } from './sagas/factsSaga';
import { exchangeSaga } from './sagas/exchangeSaga';
import { factProviderLoadSagas } from './sagas/factProviderLoadSagas';

export const passportSagas = [
  ...factsSaga,
  ...passportListSaga,
  ...exchangeSaga,
  ...factProviderLoadSagas,
];
