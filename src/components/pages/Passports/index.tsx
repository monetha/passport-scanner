import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MainTemplate } from 'src/components/layout/MainTemplate';
import './style.scss';
import { Content, Size } from 'src/components/layout/Content';
import { PageTitle } from 'src/components/text/PageTitle';
import { PassportListForm, ISubmitValues } from './PassportListForm';
import { translate } from 'src/i18n';
import { connect } from 'react-redux';
import { IState } from 'src/state/rootReducer';
import { getPassports } from 'src/state/passport/actions';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { IPassportList } from 'src/state/passport/models';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  passportList: IAsyncState<IPassportList>;
}

interface IDispatchProps {
  onLoadPassports(values: ISubmitValues);
}

interface IProps extends RouteComponentProps<any>, IStateProps, IDispatchProps {
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class PassportsPage extends React.Component<IProps> {

  public render() {
    const { onLoadPassports } = this.props;

    return (
      <MainTemplate>
        <Content size={Size.Sm}>
          <PageTitle>
            {translate(t => t.nav.passports)}
          </PageTitle>

          <PassportListForm
            onSubmit={onLoadPassports}
          />
        </Content>
      </MainTemplate>
    );
  }
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps>(
  (state: IState) => {
    return {
      passportList: state.passport.list,
    };
  },
  (dispatch) => {
    return {
      onLoadPassports(values: ISubmitValues) {
        dispatch(getPassports.init(values));
      },
    };
  },
)(PassportsPage);

export { connected as PassportsPage };

// #endregion
