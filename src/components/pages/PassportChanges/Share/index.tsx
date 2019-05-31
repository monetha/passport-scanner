import React from 'react';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './style.scss';

// #region -------------- Component ---------------------------------------------------------------

export class Share extends React.PureComponent {

  public render() {
    return (
      <div className='share'>
        <img
          src={require('images/share.png')}
          alt=''
        />
      </div>
    );
  }
  // #endregion
}
