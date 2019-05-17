import React from 'react';
import 'src/style/index.scss';
import './style.scss';
import { Switch, Route, Redirect, RouteComponentProps, withRouter } from 'react-router';
import { routes } from 'src/constants/routes';
import { PassportsPage } from '../pages/Passports';
import { PassportsChangesPage } from '../pages/PassportChanges';
import { FactProvidersPage } from '../pages/FactProviders';
import { FactProviderFactsPage } from '../pages/FactProviderFacts';
import queryString from 'query-string';
import { ethNetworkUrls } from 'src/constants/api';
import { registerBlockchainServices } from 'src/ioc/bootstrapIOC';
import { getServices } from 'src/ioc/services';

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
        <Route exact path={`${routes.Passports}/:passportFactoryAddress?`} component={PassportsPage} />
        <Route exact path={`${routes.PassportChanges}/:passportAddress?`} component={PassportsChangesPage} />
        <Route exact path={`${routes.FactProviders}/:passportAddress?`} component={FactProvidersPage} />
        <Route exact path={`${routes.FactProviderFacts}/:passportAddress?/:factProviderAddress?`} component={FactProviderFactsPage} />
        <Redirect to={routes.Passports} />
      </Switch>
    );
  }

  private initBlockchainServices() {
    const { location } = this.props;

    // Default is ropsten
    let network = ethNetworkUrls.ropsten;

    // Take from query string if it was passed
    const queryParams = queryString.parse(location.search);
    if (queryParams.network) {
      const queryNetwork = queryParams.network as string;

      if (ethNetworkUrls[queryNetwork]) {
        network = ethNetworkUrls[queryNetwork];
      } else {
        network = queryNetwork;
      }
    }

    registerBlockchainServices(getServices(), network);
  }
}

// #endregion

const routedApp = withRouter(App);
export default routedApp;
