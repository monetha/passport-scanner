import React from 'react';
import { NavBar } from 'src/components/nav/NavBar';
import './style.scss';
import { Footer } from 'src/components/nav/Footer';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps {
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

export const MainTemplate: React.SFC<IProps> = (props) => {
  return (
    <div className='mh-main-template'>
      <NavBar />

      <div className='mh-template-content'>
        {props.children}
      </div>

      <Footer />
    </div>
  )
};

// #endregion
