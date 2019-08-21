import React from 'react';
import './style.scss';
import { CopyButton } from 'src/components/form/CopyButton';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
  textToCopy?: string;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class CodeBlock extends React.PureComponent<IProps> {
  public render() {
    const { children, textToCopy } = this.props;

    return (
      <div className='mh-code-block'>
        {children}

        {textToCopy && (
          <CopyButton textToCopy={textToCopy} />
        )}
      </div>
    );
  }
}

// #endregion
