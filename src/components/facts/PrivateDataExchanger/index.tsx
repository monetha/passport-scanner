import BN from 'bn.js';
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'src/components/form/Button';
import { Alert } from 'src/components/indicators/Alert';
import { Loader } from 'src/components/indicators/Loader';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { translate } from 'src/i18n';
import { proposeDataExchange } from 'src/state/passport/actions';
import { getCanonicalFactKey } from 'src/state/passport/reducer';
import { IState } from 'src/state/rootReducer';
import { AlertInfo, getAlertsFromStatuses } from 'src/utils/alert';
import { IFactValue } from 'verifiable-data';
import { IPrivateDataHashes } from 'verifiable-data/dist/lib/passport/FactReader';
import { IProposeDataExchangeResult } from 'verifiable-data/dist/lib/passport/PrivateDataExchanger';
import './style.scss';
import { Description } from 'src/components/text/Description';
import { Header } from 'src/components/text/Header';
import { PassportInformationItem } from 'src/components/pages/PassportChanges/PassportInformation/PassportInformationItem';

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
  private alertsSince = new Date();

  public render() {
    return (
      <div className='mh-private-data-exchanger'>
        {this.renderLoader()}
        {this.renderAlerts()}
        {this.renderDataRequest()}
      </div>
    );
  }

  // #region -------------- Loader -------------------------------------------------------------------

  private renderLoader() {
    if (!this.isLoading()) {
      return null;
    }

    const msg = this.getLoaderMsg();

    return (
      <Loader
        fullArea={true}
        message={msg}
      />
    );
  }

  private isLoading() {
    const { proposalStatus } = this.props;

    if (proposalStatus && proposalStatus.isFetching) {
      return true;
    }

    return false;
  }

  private getLoaderMsg() {
    const { proposalStatus } = this.props;

    if (proposalStatus && proposalStatus.isFetching) {
      return translate(t => t.common.txExecutionInProgress);
    }

    return null;
  }

  // #endregion

  // #region -------------- Notification -------------------------------------------------------------------

  private renderAlerts() {
    const alerts = this.getAlerts();

    if (!alerts || alerts.length === 0) {
      return null;
    }

    return (
      <div className='mh-alerts-container'>
        {alerts.map(a => (
          <Alert key={a.message} type={a.type}>
            {a.message}
          </Alert>
        ))}
      </div>
    );
  }

  private getAlerts(): AlertInfo[] {
    const { proposalStatus } = this.props;

    const alerts: AlertInfo[] = [];

    const alertInfo = getAlertsFromStatuses({
      errorStatuses: [proposalStatus],
      successStatuses: [proposalStatus],
      successMessage: translate(t => t.common.txSuccess),
      since: this.alertsSince,
    });

    if (alertInfo) {
      alerts.push(alertInfo);
    }

    return alerts;
  }

  // #endregion

  // #region -------------- Request -------------------------------------------------------------------

  private renderDataRequest() {
    const { factValue } = this.props;

    return (
      <div>
        <Header>
          {translate(t => t.exchange.proposalHeader)}
        </Header>

        <Description>
          {translate(t => t.exchange.proposalDescription)}
        </Description>

        <div className='mh-fact-info'>
          <PassportInformationItem
            title={translate(t => t.passport.passportAddress)}
            address={factValue.passportAddress}
          />

          <PassportInformationItem
            title={translate(t => t.passport.factProviderAddress)}
            address={factValue.factProviderAddress}
          />

          <PassportInformationItem
            title={translate(t => t.passport.key)}
            value={factValue.key}
          />
        </div>

        <div className='mh-button-container'>
          <Button
            onClick={this.onRequestData}
          >
            {translate(t => t.exchange.requestData)}
          </Button>
        </div>
      </div>
    );
  }

  private onRequestData = () => {
    const { onRequestData } = this.props;

    this.alertsSince = new Date();

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
