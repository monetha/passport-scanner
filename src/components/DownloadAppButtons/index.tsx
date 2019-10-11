import { Links } from 'src/constants/mobile-app';
import React from 'react';
import classnames from 'classnames';
import { translate } from 'src/i18n';
import './index.scss';

// #region -------------- Interfaces -------------------------------------------------------------------

export interface IDownloadAppButton {
  url: string;
  image: string;
  text: string;
  isLightMode?: boolean;
  btnBlack?: boolean;
}

interface IProps {
  downloadButtons?: IDownloadAppButton[];
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class DownloadAppButtons extends React.PureComponent<IProps> {

  private defaultDownloadButtons: IDownloadAppButton[] = [
    {
      url: Links.appStore,
      image: require('images/mobile-app/appstore-white.svg'),
      text: translate(t => t.common.appStore),
      btnBlack: true,
    },
    {
      url: Links.googlePlay,
      image: require('images/mobile-app/play-icon.svg'),
      text: translate(t => t.common.googlePlay),
      btnBlack: true,
    },
  ];

  public render() {
    return (
      <div className='mh-download-app-buttons'>
        {this.renderDownloadAppButtons()}
      </div>
    );
  }

  public renderDownloadAppButtons() {
    const downloadButtons = this.props.downloadButtons || this.defaultDownloadButtons;

    return downloadButtons.map((button, index) => (
      <a
        key={index}
        className={classnames({
          btn: true,
          'btn-white': button.isLightMode,
          'btn-black': button.btnBlack,
        })}
        href={button.url}
        target='_blank'
      >
        <img src={button.image} alt='' />
        <div>
          <div>{translate(t => t.common.availableOn)}</div>
          <div className='btn-title'>{button.text}</div>
        </div>
      </a>
    ));
  }
}

// #endregion
