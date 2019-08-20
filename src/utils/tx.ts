import moment from 'moment';
import Web3 from 'web3';
import { TransactionReceipt, TransactionConfig } from 'web3-core';
import { Block } from 'web3-eth';
import { sendTransaction, getProviderInstance } from './walletProvider';

/**
 * waitReceipt waits for transaction to finish for the given txHash,
 * returns a promise which is resolved when transaction finishes.
 * @param {string} txHash a string with transaction hash as value
 */
export const waitReceipt = async (web3: Web3, txHash: string): Promise<TransactionReceipt> => {
  for (let i = 0; i < 50; i += 1) {

    const receipt = await web3.eth.getTransactionReceipt(txHash);

    if (!receipt) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }

    if (!receipt.status) {
      console.error(receipt);
      throw new Error('Transaction has failed');
    }

    return receipt;
  }

  throw new Error('Failed to get receipt after 50 retries');
};

/**
 * Sends given transaction using current wallet provider and waits until it is mined
 */
export const sendAndWaitTx = async (txConfig: TransactionConfig): Promise<TransactionReceipt> => {
  const txHash = await sendTransaction(txConfig);

  const web3 = new Web3(getProviderInstance());

  return waitReceipt(web3, txHash);
};

export async function getBlockDate(web3: Web3, blockNr: number) {
  const block: Block = await web3.eth.getBlock(blockNr);
  if (!block) {
    return null;
  }

  return moment(new Date(Number(block.timestamp) * 1000));
}
