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

  const newQueryParams: any = {
    network: factSelector.network || '',
  };

  // No pass addr? Redirect to identity search
  const passportAddress = factSelector.passaddr;
  if (!web3.utils.isAddress(passportAddress)) {
    return (
      <Redirect from={from} to={createRouteUrl(location, routes.Identity, newQueryParams as IParsedQueryString)} />
    );
  }

  // Otherwise go to concrete identity
  const concretePassPath = `${routes.Identity}/${passportAddress}`;

  const factProvider = factSelector.factprovideraddr;
  if (web3.utils.isAddress(factProvider)) {
    newQueryParams.fact_provider = factProvider;
  }

  newQueryParams.fact_key = factSelector.factkey || '';

  return (
    <Redirect from={from} to={createRouteUrl(location, concretePassPath, newQueryParams as IParsedQueryString)} />
  );
};
