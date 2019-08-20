import React from 'react';
import { IFactValueWrapper } from 'src/state/passport/models';
import { connect } from 'react-redux';
import { IState } from 'src/state/rootReducer';
import './style.scss';

// #region -------------- Interfaces --------------------------------------------------------------

interface IStateProps {
}

interface IDispatchProps {
}

export interface IProps {
  factValue: IFactValueWrapper;
}

interface ICombinedProps extends IStateProps, IDispatchProps, IProps {
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class PrivateDataExchanger extends React.PureComponent<ICombinedProps> {

  public render() {
    return (
      <div className='mh-private-data-exchanger'>
        DATA EXCHANGER
      </div>
    );
  }

  // #endregion
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps>(
  (_state: IState) => {
    return {
    };
  },
  (_dispatch) => {
    return {
    };
  },
)(PrivateDataExchanger);

export { connected as PrivateDataExchanger };

// #endregion
