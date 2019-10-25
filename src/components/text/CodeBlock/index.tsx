import React from 'react';
import './style.scss';
import { CopyButton } from 'src/components/form/CopyButton';
import classnames from 'classnames';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  textToCopy?: string;
  compact?: boolean;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class CodeBlock extends React.PureComponent<IProps> {
  public render() {
    const { children, textToCopy, compact } = this.props;

    return (
      <div className={classnames('mh-code-block', compact && 'mh-compact')}>
        <div className='mh-contents'>
          {children}
        </div>

        {textToCopy && (
          <CopyButton textToCopy={textToCopy} />
        )}
      </div>
    );
  }
}

// #endregion
