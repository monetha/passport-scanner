import React from 'react';
import './style.scss';
import { translate } from 'src/i18n';

interface IProps {
  disabled: boolean;
}

export class PassportSearchButton extends React.PureComponent<IProps> {

  public render() {
    return (
      <button
        type='submit'
        disabled={this.props.disabled}
        className='mh-btn passport-search-button'
      >
        {translate(t => t.common.load)}
      </button>
    );
  }
}
