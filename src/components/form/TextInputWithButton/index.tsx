import React from 'react';
import './style.scss';
import { TextInput, IProps } from 'src/components/form/TextInput';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IWithButtonProps extends IProps {
  button: React.ReactNode;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class TextInputWithButton extends TextInput {

  public render() {
    const { customButton, ...rest } = this.props;

    return (
      <>
        <TextInput
          {...rest}
          className='with-button'
          style={{ borderRadius: '5px 0 0 5px'   }}
        />
        {customButton}
        {/*<button>hello</button>*/}
      </>
    );
  }
}

// #endregion
