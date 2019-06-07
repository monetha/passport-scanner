import React from 'react';
import classnames from 'classnames';
import './style.scss';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends React.HTMLProps<HTMLHeadingElement> {
  header: string;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class FormWrapper extends React.PureComponent<IProps> {
  public render() {
    const { children, className, header, ...rest } = this.props;

    return (
      <div
        {...rest}
        className={classnames('mh-form-wrapper', className)}
      >
        <h1>{header}</h1>
        {children}
      </div>
    );
  }
}

// #endregion
