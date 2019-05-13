import React from 'react';
import 'src/style/index.scss';
import './style.scss';
import { Switch, Route, Redirect } from 'react-router';
import { routes } from 'src/constants/routes';
import { PassportsPage } from '../pages/Passports';

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
        <Route exact path={routes.Root} component={PassportsPage} />
        <Redirect to={routes.Root} />
      </Switch>
    );
  }
}

// #endregion
