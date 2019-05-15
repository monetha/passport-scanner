import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MainTemplate } from 'src/components/layout/MainTemplate';
import './style.scss';
import { Content } from 'src/components/layout/Content';
import { PageTitle } from 'src/components/text/PageTitle';
import { PassportListForm } from './PassportListForm';

export class PassportsPage extends React.Component<RouteComponentProps<any>> {

  public render() {
    return (
      <MainTemplate>
        <Content>
          <PageTitle>
            Passports
          </PageTitle>

          <PassportListForm />
        </Content>
      </MainTemplate>
    );
  }
}
