import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { createBrowserHistory } from 'history';
import { bootstrapRedux } from './state/bootstrapRedux';
import { bootstrapIOC } from './ioc/bootstrapIOC';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

require('images/favicon.ico');

const history = createBrowserHistory();
const store = bootstrapRedux({}, history);
bootstrapIOC(store);

const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    MOUNT_NODE,
  );
};

if ((module as any).hot) {
  (module as any).hot.accept(['src/components/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}

render();
