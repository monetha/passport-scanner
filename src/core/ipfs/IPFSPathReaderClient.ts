import { IIPFSClient } from 'reputation-sdk';
import { createFriendlyError } from '../error/FriendlyError';
import { ErrorCode } from '../error/ErrorCode';

export class IPFSPathReaderClient implements IIPFSClient {
  public async add(): Promise<any> {
    throw createFriendlyError(ErrorCode.NOT_SUPPORTED, 'This operation is not supported');
  }

  public async cat(path: string): Promise<string> {
    return path;
  }
}
