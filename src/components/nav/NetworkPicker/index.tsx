import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './style.scss';
import { getServices } from 'src/ioc/services';
import { translate } from 'src/i18n';
import classnames from 'classnames';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';
import { TextInput } from 'src/components/form/TextInput';
import { registerBlockchainServices } from 'src/ioc/bootstrapIOC';
import queryString from 'query-string';
import { DropdownIndicator } from 'src/components/indicators/DropdownIndicator';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps extends RouteComponentProps<any> {
}

interface IState {
  isOpen: boolean;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class NetworkPicker extends React.Component<IProps, IState> {

  public constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  public render() {

    return (
      <div className='mh-network-picker'>
        {this.renderSelected()}
      </div>
    );
  }

  // #region -------------- Selected box -------------------------------------------------------------------

  private renderSelected() {
    const { isOpen } = this.state;

    return (
      <Tooltip
        position='bottom'
        distance={-2}
        offset={-70}
        theme='light'
        animateFill={false}
        trigger='click'
        open={this.state.isOpen}
        onRequestClose={() => this.onOpenToggle(false)}
        interactive={true}
        arrow={false}
        hideOnClick={true}
        html={this.renderPopupContents()}
      >
        <div
          className={classnames('mh-selected-network-box', {
            'mh-is-open': isOpen,
          })}
          onClick={this.onSelectedBoxClick}
        >
          <div>
            <div className='mh-value'>
              {getServices().ethNetwork.name}
            </div>
          </div>
          <DropdownIndicator isOpened={isOpen} />
        </div>
      </Tooltip>
    );
  }

  private onSelectedBoxClick = () => {
    this.onOpenToggle();
  }

  private onOpenToggle = (value?: boolean) => {
    this.setState({
      isOpen: value !== undefined ? !!value : !this.state.isOpen,
    });
  }

  // #endregion

  // #region -------------- Popup -------------------------------------------------------------------

  private renderPopupContents() {
    const { ethNetwork, allEthNetworks } = getServices();

    return (
      <div className='mh-network-picker-popup-content'>
        {allEthNetworks.map(net => (
          <div key={net.url}>
            <button
              type='button'
              data-url={net.url}
              disabled={ethNetwork.alias === net.alias}
              onClick={this.onNetworkButtonClick}
            >
              {net.name}
            </button>
          </div>
        ))}

        <div>
          <TextInput
            defaultValue={ethNetwork.alias ? undefined : ethNetwork.url}
            onBlur={this.onNetworkInputBlur}
            onKeyUp={this.onNetworkInputKeyUp}
            placeholder={`${translate(t => t.ethereum.customUrl)}...`}
            max={128}
          />
        </div>
      </div>
    );
  }

  private onNetworkButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.onNetworkChange(e.currentTarget.dataset.url);
  }

  private onNetworkInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.onNetworkChange(e.currentTarget.value);
  }

  private onNetworkInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== 13) {
      return;
    }

    e.preventDefault();

    this.onNetworkChange(e.currentTarget.value);
  }

  private onNetworkChange = (url: string) => {
    if (!url || !url.trim()) {
      return;
    }

    const { allEthNetworks } = getServices();

    const newUrl = url.trim();

    // Try matching with one of pre-configured nets
    let newNetwork = allEthNetworks.find(n => n.alias === newUrl || n.url === newUrl);

    if (!newNetwork) {
      newNetwork = {
        url: newUrl,
        name: newUrl,
      };
    }

    registerBlockchainServices(getServices(), allEthNetworks, newNetwork);

    const { location, history } = this.props;
    const newQueryParams = { ...queryString.parse(location.search) };

    newQueryParams.network = newNetwork.alias || newNetwork.url;

    const newSearch = queryString.stringify(newQueryParams);
    const newPageUrl = `${location.pathname}?${newSearch}`;

    history.replace(newPageUrl);

    this.onOpenToggle(false);
  }

  // #endregion
}

// #endregion

const router = withRouter(NetworkPicker);
export { router as NetworkPicker };
