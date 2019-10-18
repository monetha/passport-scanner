import React from 'react';
import { Redirect } from 'react-router';
import { createRouteUrl, IParsedQueryString } from 'src/utils/nav';
import { parse } from 'query-string';
import { Location } from 'history';
import { routes } from 'src/constants/routes';

interface IProps {
  from: string;
  location: Location;
}

interface IFactSelector {
  passaddr?: string;
  factprovideraddr?: string;
  factkey?: string;
  network?: string;
}

export const DataExchangeRedirect = ({ location, from }: IProps) => {
  const { search } = location;

  const factSelector: IFactSelector = parse(search);
  const formValues: any = {
    fact_provider: factSelector.factprovideraddr,
    fact_key: factSelector.factkey,
    network: factSelector.network,
  };

  const base = `${routes.Identity}/${factSelector.passaddr || ''}`;

  const routeUrl = createRouteUrl(location, base, formValues as IParsedQueryString);

  return <Redirect from={from} to={routeUrl} />;
};
