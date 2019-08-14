import { EventType, DataType } from 'verifiable-data';

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
    view: 'View',
    download: 'Download',
    noData: 'No data',
  },
  nav: {
    passportSearch: 'Digital identity search',
    passportRegistry: 'Digital identity registry',
  },
  footer: {
    copyright: '© 2019 Monetha. All rights reserved.',
  },
  form: {
    factoryAddress: 'Factory address',
    passportAddress: 'Address',
    startBlock: 'Start block',
    advancedSearch: 'Advanced search',
  },
  ethereum: {
    ropsten: 'Ropsten',
    mainnet: 'Mainnet',
    customUrl: 'Custom url',
  },
  passport: {
    passports: 'Digital identities',
    passport: 'Digital identity',
    passportAddress: 'Address',
    firstOwnerAddress: 'First owner address',
    ownedBy: 'Owned by',
    pendingOwner: 'Pending owner',
    owner: 'Owner',
    passportLogicRegistry: 'Logic registry',
    blockNumber: 'Block #',
    txHash: 'Transaction hash',
    factProvider: 'Data source',
    factProviderAddress: 'Data source address',
    key: 'Key',
    dataType: 'Data type',
    changeType: 'Change',
    value: 'Value',
    viewChanges: 'View changes',
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
    tooLong: 'Too long to display, truncated. Please download full value.',
  },
});

export default translations;

  // tslint:enable:max-line-length
