import React from 'react';
import { Redirect } from 'react-router';
import { createRouteUrl, IParsedQueryString } from 'src/utils/nav';
import { parse } from 'query-string';
import { Location } from 'history';

interface IProps {
  from: string;
  to: string;
  location: Location;
}

export const PassportChangesRedirect = ({ location, from, to }: IProps) => {
  const { pathname, search } = location;
  const regex = new RegExp(from);
  const newLocation = pathname.replace(regex, to);

  const parsedQueryString = { ...parse(search) };
  const routeUrl = createRouteUrl(location, newLocation, parsedQueryString as IParsedQueryString);

  return <Redirect from={from} to={routeUrl}/>;
};
