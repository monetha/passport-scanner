
// tslint:disable:max-line-length

interface ITranslation {
  [key: string]: string | ITranslation;
}

/**
 * Validate at compile-time whether given translation tree has valid structure
 */
const validateBaseTranslations = <T extends ITranslation>(tree: T) => {
  return tree;
};

const translations = validateBaseTranslations({
  errors: {
    somethingUnexpectedHasHappended: 'Something unexpected has happened',
    connectivityProblems: 'There are some connectivity problems',
    timeout: 'The operation has timed out. \nPlease check your internet connection',
  },
  common: {
    submit: 'Submit',
  },
  nav: {
    passports: 'Passports',
    passportChanges: 'Passport changes',
    factProviders: 'Fact providers',
    factProviderFacts: 'Fact provider facts',
  },
  footer: {
    copyright: '© 2019 Monetha. All rights reserved.',
  },
  form: {
    factoryAddress: 'Passport factory address',
    startBlock: 'Start block',
  },
});

export default translations;

  // tslint:enable:max-line-length
