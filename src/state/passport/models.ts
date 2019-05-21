import { IPassportRef, IFact } from 'src/models/passport';
import { DataType, IFactValue } from 'reputation-sdk';

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

export interface IFactValueWrapper<T = any> {
  dataType: DataType;
  value: IFactValue<T>;
}
