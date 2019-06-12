import { replace } from 'connected-react-router';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Alert, AlertType } from 'src/components/indicators/Alert';
import { Loader } from 'src/components/indicators/Loader';
import { Content, Size } from 'src/components/layout/Content';
import { MainTemplate } from 'src/components/layout/MainTemplate';
import { FormWrapper } from 'src/components/text/FormWrapper';
import { routes } from 'src/constants/routes';
import { IAsyncState } from 'src/core/redux/asyncAction';
import { translate } from 'src/i18n';
import { getFacts } from 'src/state/passport/actions';
import { IFactList } from 'src/state/passport/models';
import { IState } from 'src/state/rootReducer';
import { createRouteUrl } from 'src/utils/nav';
import { FactsList } from './FactsList';
import { FactsListForm, ISubmitValues } from './FactsListForm';
import './style.scss';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IStateProps {
  factList: IAsyncState<IFactList>;
}

interface IDispatchProps {
  onLoadFacts(values: ISubmitValues);
}

interface IProps extends RouteComponentProps<any>, IStateProps, IDispatchProps {
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

class PassportChangesPage extends React.Component<IProps> {
  private showErrorsSince = new Date();

  public render() {
    const { onLoadFacts } = this.props;

    return (
      <MainTemplate className='mh-passport-changes-page'>
        <Content size={Size.Md}>
          <div>
            <FormWrapper
              header={translate(t => t.nav.passportSearch)}
            >
              <div className='facts-list-form'>
                <FactsListForm
                  onSubmit={onLoadFacts}
                  disabled={this.isLoading()}
                />
              </div>
            </FormWrapper>

            <div className='facts-list'>
              <div className='mh-list'>
                {this.renderLoader()}
                {this.renderError()}
                {this.renderList()}
              </div>
            </div>
          </div>
        </Content>
      </MainTemplate>
    );
  }

  private renderList() {
    const { factList } = this.props;

    if (this.isLoading() || !factList.data || factList.error) {
      return null;
    }

    return (
      <div className='mh-list-contents'>
        <FactsList items={factList.data.facts} />
      </div>
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
    const { factList } = this.props;

    if (this.isLoading() || !factList.error) {
      return null;
    }

    if (factList.errorTimestamp < this.showErrorsSince) {
      return null;
    }

    return (
      <Alert
        type={AlertType.Error}
      >
        {factList.error.friendlyMessage}
      </Alert>
    );
  }

  private isLoading() {
    const { factList } = this.props;

    return factList.isFetching;
  }
}

// #endregion

// #region -------------- Connect -------------------------------------------------------------------

const connected = connect<IStateProps, IDispatchProps, RouteComponentProps<any>, IState>(
  (state) => {
    return {
      factList: state.passport.facts,
    };
  },
  (dispatch, ownProps) => {
    return {
      onLoadFacts(values: ISubmitValues) {

        const newUrl = createRouteUrl(ownProps.location, `${routes.PassportChanges}/${values.passportAddress}`, {
          start_block: values.startBlock && values.startBlock.toString(),
          fact_provider: values.factProviderAddress,
        });

        dispatch(replace(newUrl));
        dispatch(getFacts.init(values));
      },
    };
  },
)(PassportChangesPage);

export { connected as PassportChangesPage };

// #endregion
