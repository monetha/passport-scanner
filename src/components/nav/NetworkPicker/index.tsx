import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './style.scss';
import { getServices } from 'src/ioc/services';
import { ethNetworkUrls } from 'src/constants/api';
import { translate } from 'src/i18n';
import classnames from 'classnames';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps extends RouteComponentProps<any> {
}

interface IState {

}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class NetworkPicker extends React.Component<IProps, IState> {

  public render() {

    return (
      <div className='mh-network-picker'>
        {this.renderSelected()}
      </div>
    );
  }

  private renderSelected() {
    return (
      <div className='mh-selected-network-box'>
        <div>
          <div className='mh-label'>
            {translate(t => t.ethereum.network)}
          </div>

          <div className='mh-value'>
            {this.getSelectedNetworkInfo().name}
          </div>
        </div>

        <div>
          <div className={classnames('mh-dropdown-indicator', {

          })}/>
        </div>
      </div>
    )
  }

  private getSelectedNetworkInfo() {
    const { ethNetworkUrl } = getServices();

    switch (ethNetworkUrl) {
      case ethNetworkUrls.mainnet:
        return {
          url: ethNetworkUrl,
          name: translate(t => t.ethereum.mainnet),
          alias: 'mainnet',
        };

      case ethNetworkUrls.ropsten:
        return {
          url: ethNetworkUrl,
          name: translate(t => t.ethereum.ropsten),
          alias: 'ropsten',
        };

      default:
        return {
          url: ethNetworkUrl,
          name: ethNetworkUrl,
        };
    }
  }
}

// #endregion

const router = withRouter(NetworkPicker);
export { router as NetworkPicker };
