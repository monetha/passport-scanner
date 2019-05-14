import React from 'react';
import { RouteComponentProps } from 'react-router';
import { MainTemplate } from 'src/components/layout/MainTemplate';
import './style.scss';
import { Content } from 'src/components/layout/Content';

export class PassportsPage extends React.Component<RouteComponentProps<any>> {

  public render() {
    return (
      <MainTemplate>
        <Content>
          This is passports list page
        </Content>
      </MainTemplate>
    );
  }
}
