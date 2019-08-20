import BN from 'bn.js';
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'src/components/form/Button';
import { translate } from 'src/i18n';
import { proposeDataExchange } from 'src/state/passport/actions';
import { IState } from 'src/state/rootReducer';
import { IFactValue } from 'verifiable-data';
import { IPrivateDataHashes } from 'verifiable-data/dist/lib/passport/FactReader';
import './style.scss';
import { getCanonicalFactKey } from 'src/state/passport/reducer';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { IProposeDataExchangeResult } from 'verifiable-data/dist/lib/passport/PrivateDataExchanger';

// #region -------------- Interfaces --------------------------------------------------------------

interface IStateProps {
  proposalStatus: IAsyncState<IProposeDataExchangeResult>;
}

interface IDispatchProps {
  onRequestData(stake: BN);
}

export interface IProps {
  factValue: IFactValue<IPrivateDataHashes>;
}

interface ICombinedProps extends IStateProps, IDispatchProps, IProps {
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class PrivateDataExchanger extends React.PureComponent<ICombinedProps> {

  public render() {
    return (
      <div className='mh-private-data-exchanger'>
        {this.renderDataRequest()}
      </div>
    );
  }

  // #region -------------- Request -------------------------------------------------------------------

  private renderDataRequest() {
    return (
      <div>
        <Button
          onClick={this.onRequestData}
        >
          {translate(t => t.exchange.requestData)}
        </Button>
      </div>
    );
  }

  private onRequestData = () => {
    const { onRequestData } = this.props;

    onRequestData(new BN(0));
  }

  // #endregion
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, IProps, IState>(
  (state, ownProps) => {
    const { passportAddress, factProviderAddress, key } = ownProps.factValue;
    const canonicalKey = getCanonicalFactKey(passportAddress, factProviderAddress, key);

    return {
      proposalStatus: state.passport.exchangeProposal[canonicalKey],
    };
  },
  (dispatch, ownProps) => {
    return {
      onRequestData: (stake: BN) => {
        const { factValue } = ownProps;

        dispatch(proposeDataExchange.init({
          factValue,
          stake,
        }));
      },
    };
  },
)(PrivateDataExchanger);

export { connected as PrivateDataExchanger };

// #endregion
