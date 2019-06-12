import React from 'react';
import './style.scss';
import { translate } from 'src/i18n';
import { DropdownIndicator } from 'src/components/DropdownIndicator';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IState {
  isOpened: boolean;
}

export interface IProps extends React.HTMLProps<HTMLHeadingElement> {
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class ShowAdvanced extends React.PureComponent<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = {
      isOpened: false,
    };
  }

  public render() {
    const { children, className } = this.props;

    return (
      <>
        <div
          onClick={() => this.setState(({ isOpened }) => ({ isOpened: !isOpened }))}
          className={`advanced-search ${className || ''}`}
        >
          {translate(t => t.form.advancedSearch)}
          <DropdownIndicator isOpened={this.state.isOpened} />
        </div>
        {this.state.isOpened &&
        children}
      </>
    );
  }
}

// #endregion
