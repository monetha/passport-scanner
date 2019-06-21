export const routes = {
  Root: '/',
  Passports: '/registry',
  Passport: '/passport',
  LegacyPassportChanges: '/passport-changes',
  Loading: '/loading',
};

export const passportsPath = `${routes.Passports}/:passportFactoryAddress?`;
export const passportPath = `${routes.Passport}/:passportAddress?`;
