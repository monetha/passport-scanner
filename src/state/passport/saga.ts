import { passportListSaga } from './sagas/passportListSaga';
import { factsSaga } from './sagas/factsSaga';

export const passportSagas = [
  ...factsSaga,
  ...passportListSaga,
];
