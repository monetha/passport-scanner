import React from 'react';
import { Alert, AlertType } from '../Alert';

// #region -------------- Interface -------------------------------------------------------------------

interface IComponentState {
  error: any;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class ErrorBoundary extends React.Component<{}, IComponentState> {

  public constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  public render() {
    const { error } = this.state;
    if (error) {
      return this.renderError();
    }

    return this.props.children;
  }

  public static getDerivedStateFromError(error) {
    return { error };
  }

  private renderError() {
    const { error } = this.state;
    if (!error) {
      return null;
    }

    return (
      <Alert type={AlertType.Error}>
        {error.friendlyMessage || error.message || error.toString() || JSON.stringify(error)}
      </Alert>
    );
  }

}

// #endregion
