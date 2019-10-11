import React from 'react';
import { connect } from 'react-redux';
import { IFactProviderInfo } from 'verifiable-data';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { IState } from 'src/state/rootReducer';
import { loadFactProviderInfo } from 'src/state/passport/actions';

// #region -------------- Interfaces --------------------------------------------------------------

interface IStateProps {
  info: IAsyncState<IFactProviderInfo, any>;
}

interface IDispatchProps {
  onLoadInfo();
}

interface IOwnProps {
  factProviderAddress: string;
  dataForChildren?: any;
  children: (factProviderInfo: IAsyncState<IFactProviderInfo>, factProviderAddress: string, customData?: any) => {};
}

interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class FactProviderInfoLoader extends React.PureComponent<IProps> {
  public componentDidMount() {
    const { factProviderAddress } = this.props;
    if (!factProviderAddress) {
      return;
    }

    this.props.onLoadInfo();
  }

  public componentDidUpdate(prevProps) {
    const { factProviderAddress } = this.props;
    if (!factProviderAddress) {
      return;
    }

    // Reload info only when address has changed
    if (prevProps.factProviderAddress === factProviderAddress) {
      return;
    }

    this.props.onLoadInfo();
  }

  public render() {
    const { children, info, factProviderAddress, dataForChildren } = this.props;

    return children(info, factProviderAddress, dataForChildren);
  }
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, IOwnProps, IState>(
  (state, ownProps) => {
    const { factProviderInfos } = state.passport;

    return {
      info: factProviderInfos[ownProps.factProviderAddress],
    };
  },
  (dispatch, ownProps) => {
    return {
      onLoadInfo: () => dispatch(loadFactProviderInfo.init(ownProps.factProviderAddress, {
        cacheTimeout: 30 * 60,
      })),
    };
  })(FactProviderInfoLoader);

export { connected as FactProviderInfoLoader };

// #endregion
