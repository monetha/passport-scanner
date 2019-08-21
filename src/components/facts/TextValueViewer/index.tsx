import React from 'react';
import { ActionButton } from 'src/components/form/ActionButton';
import { translate } from 'src/i18n';
import { IFactValueWrapper } from 'src/state/passport/models';
import { IFactValue } from 'verifiable-data';
import './style.scss';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  factValue: IFactValueWrapper;
  onDownload(value: IFactValue<any>);
}

// #endregion

// #region -------------- Const -------------------------------------------------------------------

const displayFirstNSymbols = 5120;

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class TextValueViewer extends React.PureComponent<IProps> {

  public render() {
    const { factValue } = this.props;

    let tooLongToDisplay = false;

    let value = new TextDecoder('utf-8').decode(new Uint8Array(factValue.value.value));
    if (value.length > displayFirstNSymbols) {
      value = value.substring(0, displayFirstNSymbols);
      tooLongToDisplay = true;
    }

    return (
      <div className='mh-text-value-viewer'>
        {this.renderDownloadButton()}

        <pre>
          {value}
        </pre>

        {tooLongToDisplay &&
          <div>
            <div title={translate(t => t.passport.tooLong)} className='mh-three-dots'>{' . . . '}</div>
            {this.renderDownloadButton()}
          </div>
        }
      </div>
    );
  }

  private renderDownloadButton() {
    return (
      <ActionButton
        onClick={this.onDownloadClick}
        className='mh-view-value'
        text={translate(t => t.common.download)}
      />
    );
  }

  private onDownloadClick = () => {
    const { factValue, onDownload } = this.props;

    if (onDownload) {
      onDownload(factValue.value);
    }
  }

  // #endregion
}

// #endregion
