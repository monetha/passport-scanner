import queryString from 'query-string';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { PassportChangesRedirect } from 'src/components/pages/PassportChangesRedirect';
import { passportPath, passportsPath, routes } from 'src/constants/routes';
import { registerBlockchainServices } from 'src/ioc/bootstrapIOC';
import { getServices } from 'src/ioc/services';
import 'src/style/index.scss';
import { parseNetworkConfig } from 'src/utils/config';
import { Loader } from '../indicators/Loader';
import { PassportChangesPage } from '../pages/PassportChanges';
import { PassportsPage } from '../pages/Passports';
import './style.scss';
import { DataExchangeRedirect } from 'src/components/pages/DataExchangeRedirect';

// #region -------------- Interface -------------------------------------------------------------------

export interface IProps extends RouteComponentProps<any> {
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class App extends React.Component<IProps> {

  public constructor(props) {
    super(props);

    this.initBlockchainServices();
  }

  public render() {
    return (
      <div id='mth-app'>
        <div id='mth-app-content'>
          {this.renderRoutes()}
        </div>
      </div>
    );
  }

  private renderRoutes = () => {
    return (
      <Switch>
        <Route exact path={passportsPath} component={PassportsPage} />
        <Route exact path={`${routes.LegacyPassportChanges}*`} component={() =>
          <PassportChangesRedirect
            from={routes.LegacyPassportChanges}
            to={routes.Identity}
            location={this.props.location}
          />} />
        <Route exact path={`${routes.LegacyPassport}*`} component={() =>
          <PassportChangesRedirect
            from={routes.LegacyPassport}
            to={routes.Identity}
            location={this.props.location}
          />} />
        <Route exact path={passportPath} component={PassportChangesPage} />
        <Route exact path={routes.Loading} component={() => <Loader fullArea={true} fullscreen={true} />} />
        <Route exact path={routes.DataExchange} component={() => (
          <DataExchangeRedirect
            from={routes.DataExchange}
            location={this.props.location}
          />
        )} />
        <Redirect to={routes.Passports} />
      </Switch>
    );
  }

  private initBlockchainServices() {
    const { location } = this.props;

    const networks = parseNetworkConfig();

    let network = networks[0];

    // Take from query string if it was passed
    const queryParams = queryString.parse(location.search);
    if (queryParams.network) {
      const queryNetwork = queryParams.network as string;

      // Try matching with one of pre-configured nets
      network = networks.find(n => n.alias === queryNetwork || n.url === queryNetwork);

      if (!network) {
        network = {
          url: queryNetwork,
          name: queryNetwork,
        };
      }
    }

    registerBlockchainServices(getServices(), networks, network);
  }
}

// #endregion

const routedApp = withRouter(App);
export default routedApp;
