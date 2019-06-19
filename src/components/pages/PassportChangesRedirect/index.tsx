import React from 'react';
import { routes } from 'src/constants/routes';
import { Redirect } from 'react-router';
import { createRouteUrl, IParsedQueryString } from 'src/utils/nav';
import { parse } from 'query-string';

export const PassportChangesRedirect = ({ location }) => {
  const { pathname, search } = location;
  const regex = new RegExp(routes.LegacyPassportChanges);
  const newLocation = pathname.replace(regex, routes.Passport);

  const parsedQueryString = { ...parse(search) };
  const routeUrl = createRouteUrl(location, newLocation, parsedQueryString as IParsedQueryString);

  return <Redirect from={routes.LegacyPassportChanges} to={routeUrl}/>;
};
