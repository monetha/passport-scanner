import React from 'react';
import './style.scss';
import { TextInput, IProps } from 'src/components/form/TextInput';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IPropsTextInputWithButton extends IProps {
  customButton: React.ReactNode;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export class TextInputWithButton extends React.PureComponent<IPropsTextInputWithButton> {

  public render() {
    const { customButton, ...rest } = this.props;

    return (
      <>
        <TextInput
          {...rest}
          className='with-button'
        />
        {customButton}
      </>
    );
  }
}

// #endregion
