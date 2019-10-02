import BN from 'bn.js';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from 'src/components/form/Button';
import { Alert, AlertType } from 'src/components/indicators/Alert';
import { Loader } from 'src/components/indicators/Loader';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { translate } from 'src/i18n';
import { proposeDataExchange } from 'src/state/passport/actions';
import { getCanonicalFactKey } from 'src/state/passport/reducer';
import { IState } from 'src/state/rootReducer';
import { AlertInfo, getAlertsFromStatuses } from 'src/utils/alert';
import { IFactValue, IFactProviderInfo } from 'verifiable-data';
import { IPrivateDataHashes } from 'verifiable-data/dist/lib/passport/FactReader';
import { IProposeDataExchangeResult } from 'verifiable-data/dist/lib/passport/PrivateDataExchanger';
import './style.scss';
import { Description } from 'src/components/text/Description';
import { Header } from 'src/components/text/Header';
import { PassportInformationItem } from 'src/components/pages/PassportChanges/PassportInformation/PassportInformationItem';
import { CodeBlock } from 'src/components/text/CodeBlock';
import { FactProviderInfoLoader } from '../FactProviderInfoLoader';

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
        {this.renderContent()}
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

  // #region -------------- Content -------------------------------------------------------------------

  private renderContent() {
    const { proposalStatus } = this.props;

    // Proposal
    if (!proposalStatus || !proposalStatus.data) {
      return this.renderDataRequest();
    }

    // Proposal success
    return this.renderAcceptanceWaiting();
  }

  // #endregion

  // #region -------------- Request -------------------------------------------------------------------

  private renderDataRequest() {
    return (
      <div>
        <Header>
          {translate(t => t.exchange.proposalHeader)}
        </Header>

        <Description>
          {translate(t => t.exchange.proposalDescription)}
        </Description>

        {this.renderFactInfo()}

        <div className='mh-alerts-container'>
          <Alert type={AlertType.Info}>
            {translate(t => t.exchange.proposalForLatestVersionNotice)}
          </Alert>
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

  // #region -------------- Acceptance -------------------------------------------------------------------

  private renderAcceptanceWaiting() {
    const { proposalStatus } = this.props;

    if (!proposalStatus || !proposalStatus.data) {
      return null;
    }

    const password = Buffer.from(proposalStatus.data.exchangeKey).toString('base64');

    return (
      <div>
        <Header>
          {translate(t => t.exchange.proposalInProgressHeader)}
        </Header>

        <div className='mh-alerts-container'>
          <Alert type={AlertType.Info}>
            {translate(t => t.exchange.waitingForAcceptance)}
          </Alert>
        </div>

        <div className='mh-exchange-password'>
          <div className='mh-alerts-container'>
            <Alert type={AlertType.Warning}>
              {translate(t => t.exchange.exchangeKeyDescription)}
            </Alert>
          </div>

          <CodeBlock textToCopy={password}>
            {password}
          </CodeBlock>
        </div>

        {this.renderFactInfo()}
      </div>
    );
  }

  // #endregion

  // #region -------------- Fact info -------------------------------------------------------------------

  private renderFactInfo() {
    const { factValue } = this.props;

    return (
      <div className='mh-fact-info'>
        <PassportInformationItem
          title={translate(t => t.passport.passportAddress)}
          address={factValue.passportAddress}
        />

        <FactProviderInfoLoader factProviderAddress={factValue.factProviderAddress}>
          {this.renderFactProviderInfo}
        </FactProviderInfoLoader>

        <PassportInformationItem
          title={translate(t => t.passport.key)}
          value={factValue.key}
        />
      </div>
    );
  }

  private renderFactProviderInfo(factProviderInfo: IAsyncState<IFactProviderInfo>, factProviderAddress: string) {
    let name: string = null;
    let website: string = null;

    if (factProviderInfo && factProviderInfo.data) {
      name = factProviderInfo.data.name;
      website = factProviderInfo.data.website;
    }

    return (
      <Fragment>
        <PassportInformationItem
          title={translate(t => t.passport.factProvider)}
          address={factProviderAddress}
          addressTitle={name}
        />

        {website && (
          <PassportInformationItem
            title={translate(t => t.passport.factProviderWebsite)}
            value={(
              <a
                href={website}
                target='_blank'
              >
                {website}
              </a>
            )}
          />
        )}
      </Fragment>
    );
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
