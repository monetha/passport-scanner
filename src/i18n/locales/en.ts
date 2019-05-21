import { EventType, DataType } from 'reputation-sdk';

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
    mustBeNCharsLengths: 'Must be {{length}} characters long',
    required: 'Required',
    mustBeNumber: 'Must be a number',
    containsInvalidChars: 'Contains invalid characters',
    invalidAddress: 'Address is invalid',
    mustBePositiveNumber: 'Must be a positive number',
    mustBeWholeNumber: 'Must be a whole number',
    tooManyResults: 'Too many results',
  },
  common: {
    submit: 'Submit',
    load: 'Load',
    download: 'Download',
    noData: 'No data',
  },
  nav: {
    passports: 'Passports',
    passportChanges: 'Passport changes',
  },
  footer: {
    copyright: '© 2019 Monetha. All rights reserved.',
  },
  form: {
    factoryAddress: 'Passport factory address',
    passportAddress: 'Passport address',
    startBlock: 'Start block',
  },
  passport: {
    passportAddress: 'Passport address',
    firstOwnerAddress: 'First owner address',
    blockNumber: 'Block number',
    txHash: 'Transaction hash',
    factProvider: 'Fact provider',
    factProviderAddress: 'Fact provider address',
    key: 'Key',
    dataType: 'Data type',
    changeType: 'Change',
    value: 'Value',
    eventTypes: {
      [EventType.Deleted]: 'Deleted',
      [EventType.Updated]: 'Updated',
    },
    dataTypes: {
      [DataType.Address]: 'Address',
      [DataType.Bool]: 'Bool',
      [DataType.Bytes]: 'Bytes',
      [DataType.IPFSHash]: 'IPFS',
      [DataType.Int]: 'Int',
      [DataType.Uint]: 'UInt',
      [DataType.String]: 'String',
      [DataType.TxData]: 'TX data',
      [DataType.PrivateData]: 'Private data',
    },
  },
});

export default translations;

  // tslint:enable:max-line-length
