import React from 'react';
import './style.scss';
import classnames from 'classnames';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends React.HTMLProps<HTMLButtonElement> {
  icon?: React.ReactNode;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class Button extends React.PureComponent<IProps> {

  public render() {
    const { className, children, icon, ...rest } = this.props;

    return (
      <button
        className={classnames({
          'mh-btn': true,
        }, className)}
        type='button'
        {...rest}
      >
        {icon && (
          <span className='mh-icon'>
            {icon}
          </span>
        )}

        {children}
      </button>
    );
  }
}

// #endregion
