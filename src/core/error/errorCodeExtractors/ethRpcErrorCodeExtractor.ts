import { ErrorCode } from '../ErrorCode';
import { ErrorCodeExtractor } from '../ErrorHandler';

interface IRpcError {
  code?: number;
}

export const ethRpcErrorCodeExtractor: ErrorCodeExtractor = (error) => {
  const rpcError = error as IRpcError;

  if (rpcError && rpcError.code === -32005) {
    return ErrorCode.TOO_MANY_RESULTS;
  }

  return null;
};
