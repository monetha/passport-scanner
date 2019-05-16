import { IPassportRef } from 'src/models/passport';

export interface IPassportList {
  factoryAddress: string;
  startBlock: number;
  passportRefs: IPassportRef[];
}
