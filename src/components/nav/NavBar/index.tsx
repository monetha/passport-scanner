import classnames from 'classnames';
import React, { Fragment } from 'react';
import MediaQuery from 'react-responsive';
import { screenQuery } from 'src/constants/screen';
import SmoothCollapse from 'react-smooth-collapse';
import './style.scss';
import { withRouter, RouteComponentProps, matchPath, RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import { translate } from 'src/i18n';
import { passportPath, passportsPath, routes } from 'src/constants/routes';
import { Content } from 'src/components/layout/Content';
import { createRouteUrl } from 'src/utils/nav';
import { NetworkPicker } from '../NetworkPicker';

const logoImgUrl = require('src/assets/images/logo-white.svg');
const menuImgWhite = require('src/assets/images/menu-white.svg');

// #region -------------- Interfaces --------------------------------------------------------------

export interface INavBarLink {
  reactRouterPath: string;
  title?: string;
  path?: string;
  component?: React.ReactNode;
  children?: INavBarLink[];
}

export interface IProps extends RouteComponentProps<any> { }

interface IState {
  isOpen: boolean;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class NavBar extends React.PureComponent<IProps, IState> {

  private navbar: HTMLDivElement;

  public constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  public componentDidMount() {
    window.addEventListener('click', this.onWindowClick);
  }

  public componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  public render() {
    return (
      <nav
        className='mh-navbar'
        ref={this.onNavBarRef}
      >
        {this.renderDesktopMenu()}
        {this.renderMobileMenu()}
      </nav>
    );
  }

  private onNavBarRef = (ref: any) => {
    this.navbar = ref;
  }

  // #region -------------- Desktop -------------------------------------------------------------------

  private renderDesktopMenu() {
    return (
      <MediaQuery query={screenQuery.lgUp}>
        <Content className='mh-desktop-navbar'>
          {this.renderLogo()}
          <div className='mh-nav-items-container'>
            {this.renderNavItems()}
          </div>
          {this.renderNetworkPicker()}
        </Content>
      </MediaQuery>
    );
  }

  // #endregion

  // #region -------------- Mobile -------------------------------------------------------------------

  private renderMobileMenu() {
    return (
      <MediaQuery query={screenQuery.mdDown}>
        <Content className='mh-mobile-navbar'>
          <div className='mh-mobile-header'>
            {this.renderLogo()}

            <div
              className={classnames({
                'mh-navbar-toggle-button': true,
                'mh-is-open': this.state.isOpen,
              })}
              onClick={this.onMobileButtonClick}
            >
              <img src={menuImgWhite} alt='' />
            </div>
          </div>

          <div className='mh-mobile-menu-container'>
            <div className='mh-mobile-menu'>
              <SmoothCollapse expanded={this.state.isOpen}>
                {this.renderNavItems(true)}

                <div className='mh-navbar-item'>
                  <Content>
                    {this.renderNetworkPicker()}
                  </Content>
                </div>
              </SmoothCollapse>
            </div>
          </div>
        </Content>
      </MediaQuery>
    );
  }

  private toggleMenu = (value?: boolean) => {
    const willBeOpen = (value !== undefined) ? value : !this.state.isOpen;

    if (willBeOpen === this.state.isOpen) {
      return;
    }

    this.setState({
      isOpen: willBeOpen,
    });
  }

  private onMobileButtonClick = () => {
    this.toggleMenu();
  }

  private onWindowClick = (event) => {
    const isClickOutsideMenu = !this.navbar.contains(event.target);
    const isClickOutsideTooltip = !event.target.matches('[role="tooltip"], [role="tooltip"] *');

    if (isClickOutsideMenu && isClickOutsideTooltip) {
      this.toggleMenu(false);
    }
  }

  // #endregion

  // #region -------------- Logo -------------------------------------------------------------------

  private renderLogo() {
    const url = createRouteUrl(this.props.location, routes.Passports);

    return (
      <div className='mh-logo'>
        <Link to={url}>
          <img src={logoImgUrl} />
        </Link>
      </div>
    );
  }

  // #endregion

  // #region -------------- Nav items -------------------------------------------------------------------

  private renderNavItems = (isMobile?: boolean) => {

    return items.map(item => {
      if (!item) {
        return null;
      }

      const isCurrentRoute = this.isCurrentRoute(item);

      if (item.component) {
        return (
          <Fragment key={item.path}>
            {item.component};
          </Fragment>
        );
      }

      const url = createRouteUrl(this.props.location, item.path);

      return (
        <div
          key={item.path}
          className={classnames({
            'mh-navbar-item': true,
            'mh-active': isCurrentRoute,
          })}
        >
          <Link to={url}>
            {isMobile ? (
              <Content>
                {item.title}
              </Content>
            ) : item.title}
          </Link>
        </div>
      );
    });
  }

  private isCurrentRoute = (link: INavBarLink): boolean => {
    const { match } = this.props;
    const { url } = match;
    const routeProps: RouteProps = {
      path: link.reactRouterPath,
      exact: true,
      strict: false,
    };

    return matchPath(url, routeProps) !== null;
  }

  // #endregion

  // #region -------------- Network picker -------------------------------------------------------------------

  private renderNetworkPicker() {
    return (
      <NetworkPicker />
    );
  }

  // #endregion
}

const historic = withRouter(NavBar);

export { historic as NavBar };

// #endregion

// #region -------------- Items -------------------------------------------------------------------

const items: INavBarLink[] = [
  {
    title: translate(t => t.nav.passportRegistry),
    path: routes.Passports,
    reactRouterPath: passportsPath,
  },
  {
    title: translate(t => t.nav.passportSearch),
    path: routes.Identity,
    reactRouterPath: passportPath,
  },
];

// #endregion
