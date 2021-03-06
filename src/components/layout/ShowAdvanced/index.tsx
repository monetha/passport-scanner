import React from 'react';
import './style.scss';
import { translate } from 'src/i18n';
import { DropdownIndicator } from 'src/components/indicators/DropdownIndicator';

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
          className={`mh-advanced-search ${className || ''}`}
        >
          <span className='mh-advanced-search-text'>{translate(t => t.form.advancedSearch)}</span>
          <DropdownIndicator isOpened={this.state.isOpened} />
        </div>
        {this.state.isOpened &&
        children}
      </>
    );
  }
}

// #endregion
