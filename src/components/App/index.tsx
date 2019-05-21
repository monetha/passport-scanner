import queryString from 'query-string';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { ethNetworkUrls } from 'src/constants/api';
import { routes } from 'src/constants/routes';
import { registerBlockchainServices } from 'src/ioc/bootstrapIOC';
import { getServices } from 'src/ioc/services';
import 'src/style/index.scss';
import { PassportChangesPage } from '../pages/PassportChanges';
import { PassportsPage } from '../pages/Passports';
import './style.scss';

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
        <Route exact path={`${routes.PassportChanges}/:passportAddress?`} component={PassportChangesPage} />
        <Redirect to={routes.Passports} />
      </Switch>
    );
  }

  private initBlockchainServices() {
    const { location } = this.props;

    // Default is mainnet
    let network = ethNetworkUrls.mainnet;

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
