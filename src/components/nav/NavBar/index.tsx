import classnames from 'classnames';
import React, { Fragment } from 'react';
import MediaQuery from 'react-responsive';
import { screenQuery } from 'src/constants/screen';
import SmoothCollapse from 'react-smooth-collapse';
import './style.scss';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { translate } from 'src/i18n';
import { routes } from 'src/constants/routes';
import { Content } from 'src/components/layout/Content';

const logoImgUrl = require('src/assets/images/logo-white.svg');

const MenuImg = require('!babel-loader!react-svg-loader?!images/menu.svg').default;

// #region -------------- Interfaces --------------------------------------------------------------

export interface INavBarLink {
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
          {this.renderNavItems()}
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
            >
              <a href='javascript:void(0)' onClick={this.onMobileButtonClick}>
                <MenuImg />
              </a>
            </div>
          </div>

          <div className='mh-mobile-menu-container'>
            <div className='mh-mobile-menu'>
              <SmoothCollapse expanded={this.state.isOpen}>
                {this.renderNavItems(true)}
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

    if (isClickOutsideMenu) {
      this.toggleMenu(false);
    }
  }

  // #endregion

  // #region -------------- Logo -------------------------------------------------------------------

  private renderLogo() {
    return (
      <div className='mh-logo'>
        <Link to={routes.Root}>
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

      return (
        <div
          key={item.path}
          className={classnames({
            'mh-navbar-item': true,
            'mh-active': isCurrentRoute,
          })}
        >
          <Link to={item.path}>
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

    return match.url.startsWith(link.path);
  }

  // #endregion
}

const historic = withRouter(NavBar);

export { historic as NavBar };

// #endregion

// #region -------------- Items -------------------------------------------------------------------

const items: INavBarLink[] = [
  {
    title: translate(t => t.nav.passports),
    path: routes.Passports,
  },
  {
    title: translate(t => t.nav.passportChanges),
    path: routes.PassportChanges,
  },
];

// #endregion
