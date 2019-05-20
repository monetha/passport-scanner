import { IHistoryEvent } from 'reputation-sdk';

export interface IPassportRef {

  /**
   * Block number in hex
   */
  blockNumber: string;

  /**
   * TX hash
   */
  txHash: string;

  /**
   * Passport address
   */
  passportAddress: string;

  /**
   * Passport owner address
   */
  ownerAddress: string;
}

export interface IFact extends IHistoryEvent {
}
