import classNames from 'classnames';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import './style.scss';

const copyImg = require('images/copy-icon.svg');
const copiedImg = require('images/tick.svg');

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  textToCopy: string;
  className?: string;
  disabled?: boolean;
}

interface IState {
  justCopiedToClipboard?: boolean;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class CopyButton extends React.PureComponent<IProps, IState> {

  private successMessageTimeout: any;

  public constructor(props) {
    super(props);

    this.state = {};
  }

  public componentWillUnmount() {
    if (this.successMessageTimeout) {
      clearTimeout(this.successMessageTimeout);
    }
  }

  public render() {
    const { textToCopy } = this.props;

    if (this.state.justCopiedToClipboard) {
      return this.renderCopiedImage();
    }

    return (
      <span className='mh-copy-button'>
        <CopyToClipboard text={textToCopy}>
          {this.renderCopyImage()}
        </CopyToClipboard>
      </span>
    );
  }

  private renderCopyImage = () => {
    const { className, disabled } = this.props;

    const disabledClass = classNames({ disabled });

    return (
      <div className={className ? className : 'mh-copy-image'}>
        <img className={disabledClass}
          src={copyImg}
          onClick={this.onCopyClick}
        />
      </div>
    );
  }

  private renderCopiedImage = () => {
    const { className } = this.props;

    return (
      <span className='mh-copy-button'>
        <div className={className ? className : 'mh-copy-image'}>
          <img
            src={copiedImg} />
        </div>
      </span>
    );
  }

  private onCopyClick = () => {
    const { disabled } = this.props;

    if (disabled) {
      return;
    }

    this.setState({
      ...this.state,
      justCopiedToClipboard: true,
    });

    clearTimeout(this.successMessageTimeout);

    this.successMessageTimeout = setTimeout(() => {
      this.setState({
        ...this.state,
        justCopiedToClipboard: false,
      });
    }, 3000);
  }
}

// #endregion
