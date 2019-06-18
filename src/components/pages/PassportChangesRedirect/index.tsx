import { routes } from 'src/constants/routes';
import { Redirect } from 'react-router';
import React from 'react';

export const PassportChangesRedirect = ({ location }) => {
  const { pathname, search } = location;
  const regex = new RegExp(routes.LegacyPassportChanges);
  const redirectLocation = `${pathname.replace(regex, routes.Passport)}${search}`;

  return <Redirect from={routes.LegacyPassportChanges} to={redirectLocation} />;
};
