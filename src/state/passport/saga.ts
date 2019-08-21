import { passportListSaga } from './sagas/passportListSaga';
import { factsSaga } from './sagas/factsSaga';
import { exchangeSaga } from './sagas/exchangeSaga';

export const passportSagas = [
  ...factsSaga,
  ...passportListSaga,
  ...exchangeSaga,
];
