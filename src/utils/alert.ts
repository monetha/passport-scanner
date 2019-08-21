import { AlertType } from 'src/components/indicators/Alert';
import { IAsyncState } from 'src/core/redux/asyncAction';

export const getAlertsFromStatuses = (params: {
  errorStatuses?: IAsyncState<any>[],
  successStatuses?: IAsyncState<any>[],
  successMessage?: string,
  since?: Date,
}): AlertInfo => {
  if (!params) {
    return null;
  }

  const { errorStatuses, successStatuses, successMessage, since } = params;

  // Return error notification if there is new errors in errorStatuses
  if (errorStatuses && errorStatuses.length > 0) {

    const joinedUniqueErrors = errorStatuses
      .filter(status => status && status.error && !status.isFetching && (!since || status.errorTimestamp > since))
      .map(status => status.error.friendlyMessage)
      .filter((error, index, self) => self.indexOf(error) === index)
      .join('\n\n');

    if (joinedUniqueErrors) {
      return new AlertInfo(joinedUniqueErrors, AlertType.Error);
    }
  }

  // Return success notification if all new success statuses finished successfully
  if (successStatuses && successStatuses.length > 0) {

    let newSuccessStatuses = successStatuses;

    if (since) {
      newSuccessStatuses = successStatuses
        .filter(status => status && status.timestamp && status.timestamp > since);
    }

    if (newSuccessStatuses.length <= 0) {
      return null;
    }

    const finishedNewSuccessStatuses = newSuccessStatuses
      .filter(status => status && !status.error && status.isFetched);

    if (finishedNewSuccessStatuses.length === newSuccessStatuses.length) {
      return new AlertInfo(successMessage, AlertType.Success);
    }
  }

  return null;
};

export class AlertInfo {
  public message: string;
  public type: AlertType;
  public timestamp: Date;

  public constructor(message: string, type: AlertType, timestamp?: Date) {
    this.message = message;
    this.type = type;
    this.timestamp = timestamp || new Date();
  }
}
