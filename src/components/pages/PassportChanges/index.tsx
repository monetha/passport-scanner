import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MainTemplate } from 'src/components/layout/MainTemplate';
import './style.scss';
import { Content } from 'src/components/layout/Content';

export class PassportsChangesPage extends React.Component<RouteComponentProps<any>> {

  public render() {
    return (
      <MainTemplate>
        <Content>
          Passport changes
        </Content>
      </MainTemplate>
    );
  }
}
