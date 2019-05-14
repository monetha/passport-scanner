import React from 'react';
import classnames from 'classnames';
import './style.scss';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  className?: string;
  full?: boolean;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export const Content: React.SFC<IProps> = (props) => {
  const { children, className, full } = props;

  return (
    <div className={classnames('mh-content', className, {
      'mh-full': full,
    })}>
      {children}
    </div>
  );
};

// #endregion
