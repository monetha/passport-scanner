import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MainTemplate } from 'src/components/layout/MainTemplate';
import './style.scss';
import { Content, Size } from 'src/components/layout/Content';
import { FormWrapper } from 'src/components/text/FormWrapper';
import { PassportListForm, ISubmitValues } from './PassportListForm';
import { connect } from 'react-redux';
import { IState } from 'src/state/rootReducer';
import { getPassports } from 'src/state/passport/actions';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { IPassportList } from 'src/state/passport/models';
import { Loader } from 'src/components/indicators/Loader';
import { Alert, AlertType } from 'src/components/indicators/Alert';
import { PassportList } from './PassportList';
import { createRouteUrl } from 'src/utils/nav';
import { routes } from 'src/constants/routes';
import { replace } from 'connected-react-router';
import { translate } from 'src/i18n';

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

  private showErrorsSince = new Date();

  public render() {
    const { onLoadPassports } = this.props;

    return (
      <MainTemplate className='mh-passports-page'>
        <div>
          <Content size={Size.Md}>
            <FormWrapper
              header={translate(t => t.nav.passportRegistry)}
            >
              <PassportListForm
                onSubmit={onLoadPassports}
                disabled={this.isLoading()}
              />
            </FormWrapper>
          </Content>

          <Content size={Size.Md}>
            <div className='mh-list'>
              {this.renderLoader()}
              {this.renderError()}
              {this.renderList()}
            </div>
          </Content>
        </div>
      </MainTemplate>
    );
  }

  private renderList() {
    const { passportList } = this.props;

    if (this.isLoading() || !passportList.data || passportList.error) {
      return null;
    }

    return (
      <PassportList items={passportList.data.passportRefs} />
    );
  }

  private renderLoader() {
    if (!this.isLoading()) {
      return null;
    }

    return (
      <Loader />
    );
  }

  private renderError() {
    const { passportList } = this.props;

    if (this.isLoading() || !passportList.error) {
      return null;
    }

    if (passportList.errorTimestamp < this.showErrorsSince) {
      return null;
    }

    return (
      <Alert
        type={AlertType.Error}
      >
        {passportList.error.friendlyMessage}
      </Alert>
    );
  }

  private isLoading() {
    const { passportList } = this.props;

    return passportList.isFetching;
  }
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, RouteComponentProps<any>, IState>(
  (state: IState) => {
    return {
      passportList: state.passport.list,
    };
  },
  (dispatch, ownProps) => {
    return {
      onLoadPassports(values: ISubmitValues) {
        const newUrl = createRouteUrl(ownProps.location, `${routes.Passports}/${values.factoryAddress}`, {
          start_block: values.startBlock && values.startBlock.toString(),
        });

        dispatch(replace(newUrl));
        dispatch(getPassports.init(values));
      },
    };
  },
)(PassportsPage);

export { connected as PassportsPage };

// #endregion
