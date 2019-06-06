import React from 'react';
import classnames from 'classnames';
import './style.scss';
import { translate } from 'src/i18n';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends React.HTMLProps<HTMLHeadingElement> {
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class PassportRegistryFormWrapper extends React.PureComponent<IProps> {
  public render() {
    const { children, className, ...rest } = this.props;

    return (
      <div
        {...rest}
        className={classnames('mh-passport-registry-form-wrapper', className)}
      >
        <h1>{translate(t => t.nav.passportRegistry)}</h1>
        {children}
      </div>
    );
  }
}

// #endregion
