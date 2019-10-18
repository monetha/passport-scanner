export const routes = {
  Root: '/',
  Passports: '/registry',
  LegacyPassport: '/passport',
  LegacyPassportChanges: '/passport-changes',
  Identity: '/identity',
  Loading: '/loading',
  DataExchange: '/data-exchange/propose',
};

export const passportsPath = `${routes.Passports}/:passportFactoryAddress?`;
export const passportPath = `${routes.Identity}/:passportAddress?`;
