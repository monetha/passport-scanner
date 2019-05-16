import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MainTemplate } from 'src/components/layout/MainTemplate';
import './style.scss';
import { Content, Size } from 'src/components/layout/Content';
import { PageTitle } from 'src/components/text/PageTitle';
import { PassportListForm } from './PassportListForm';
import { translate } from 'src/i18n';

export class PassportsPage extends React.Component<RouteComponentProps<any>> {

  public render() {
    return (
      <MainTemplate>
        <Content size={Size.Sm}>
          <PageTitle>
            {translate(t => t.nav.passports)}
          </PageTitle>

          <PassportListForm />
        </Content>
      </MainTemplate>
    );
  }
}
