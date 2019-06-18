import React from 'react';
import { routes } from 'src/constants/routes';
import { Redirect } from 'react-router';
import { createRouteUrl, IParsedQueryString } from 'src/utils/nav';
import { parse } from 'query-string';

export const PassportChangesRedirect = ({ location }) => {
  const newLocation = { ...location };
  const { pathname } = newLocation;
  const regex = new RegExp(routes.LegacyPassportChanges);
  newLocation.pathname = pathname.replace(regex, routes.Passport);
  const parsedQueryString = parse(newLocation.search);

  const routeUrl = createRouteUrl(newLocation, routes.Passport, parsedQueryString as IParsedQueryString);

  return <Redirect from={routes.LegacyPassportChanges} to={routeUrl} />;
};
