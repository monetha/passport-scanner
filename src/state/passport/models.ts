import { DataType, IFactValue, IPassportRef, IHistoryEvent } from 'verifiable-data';

export interface IPassportList {
  factoryAddress: string;
  startBlock: number;
  passportRefs: IPassportRef[];
}

export interface IFactList {
  passportAddress: string;
  startBlock: number;
  facts: IHistoryEvent[];
}

export interface IFactValueWrapper<T = any> {
  dataType: DataType;
  value: IFactValue<T>;
}
