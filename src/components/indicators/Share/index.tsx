import React from 'react';
import './style.scss';

// #region -------------- Component ---------------------------------------------------------------

export class Share extends React.PureComponent {

  public render() {
    return (
      <div className='mh-share'>
        <img
          src={require('images/share.png')}
          alt=''
        />
      </div>
    );
  }
  // #endregion
}
