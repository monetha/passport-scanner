import React from 'react';
import 'src/style/index.scss';
import './style.scss';
import { Switch, Route, Redirect } from 'react-router';
import { routes } from 'src/constants/routes';
import { PassportsPage } from '../pages/Passports';
import { PassportsChangesPage } from '../pages/PassportChanges';
import { FactProvidersPage } from '../pages/FactProviders';
import { FactProviderFactsPage } from '../pages/FactProviderFacts';

// #region -------------- Component ---------------------------------------------------------------

export default class App extends React.Component<{}> {
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
}

// #endregion
