import React from 'react';
import classnames from 'classnames';
import './style.scss';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends React.HTMLProps<HTMLHeadingElement> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class Header extends React.PureComponent<IProps> {
  public render() {
    const { children, className, size, ...rest } = this.props;

    const hSize = size || 1;

    const HeaderTag = `h${hSize}`;

    return (
      <HeaderTag
        {...rest as any}
        className={classnames('mh-header', className)}
      >
        {children}
      </HeaderTag>
    );
  }
}

// #endregion
