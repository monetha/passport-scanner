import { IPassportRef, IFact } from 'src/models/passport';

export interface IPassportList {
  factoryAddress: string;
  startBlock: number;
  passportRefs: IPassportRef[];
}

export interface IFactList {
  passportAddress: string;
  startBlock: number;
  facts: IFact[];
}
