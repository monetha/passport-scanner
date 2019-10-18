import React from 'react';
import { Redirect } from 'react-router';
import { createRouteUrl, IParsedQueryString } from 'src/utils/nav';
import { parse } from 'query-string';
import { Location } from 'history';
import { routes } from 'src/constants/routes';
import { getServices } from 'src/ioc/services';

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

  const { web3 } = getServices();

  const factSelector: IFactSelector = parse(search);

  const formValues: any = {
    network: factSelector.network || '',
  };

  const passportAddress = factSelector.passaddr;
  if (!web3.utils.isAddress(passportAddress)) {
    return <Redirect from={from} to={createRouteUrl(location, routes.Identity, formValues as IParsedQueryString)} />;
  }

  const base = `${routes.Identity}/${passportAddress}`;

  const factProvider = factSelector.factprovideraddr;
  if (!web3.utils.isAddress(factProvider)) {
    return <Redirect from={from} to={createRouteUrl(location, base, formValues as IParsedQueryString)} />;
  }

  formValues.fact_provider = factProvider;
  formValues.fact_key = factSelector.factkey || '';

  const routeUrl = createRouteUrl(location, base, formValues as IParsedQueryString);

  return <Redirect from={from} to={routeUrl} />;
};
