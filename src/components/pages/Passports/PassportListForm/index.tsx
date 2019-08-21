import { Form, Formik } from 'formik';
import queryString from 'query-string';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { FormikField } from 'src/components/form/FormikField';
import { TextInput } from 'src/components/form/TextInput';
import { ShowAdvanced } from 'src/components/layout/ShowAdvanced';
import { translate } from 'src/i18n';
import * as Yup from 'yup';
import './style.scss';
import { getServices } from 'src/ioc/services';
import { ethNetworkUrls } from 'src/constants/api';
import { defaultAddresses } from 'src/constants/addresses';
import { SearchButton } from 'src/components/form/SearchButton';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends RouteComponentProps<any> {
  onSubmit(values: ISubmitValues);
  disabled: boolean;
}

interface IFormValues {
  factoryAddress: string;
  startBlock: string;
}

export interface ISubmitValues {
  factoryAddress: string;
  startBlock: number;
}

// #endregion

// #region -------------- Form validation schema -------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  factoryAddress: Yup.string()
    .trim()
    .required(translate(t => t.errors.required))
    .length(42, translate(t => t.errors.mustBeNCharsLengths, { length: '${length}' }))
    .matches(/^0x[a-f0-9]+$/i, translate(t => t.errors.invalidAddress)),
  startBlock: Yup.number()
    .typeError(translate(t => t.errors.mustBeNumber))
    .notRequired()
    .positive(translate(t => t.errors.mustBePositiveNumber))
    .integer(translate(t => t.errors.mustBeWholeNumber)),
});

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class PassportListForm extends React.PureComponent<IProps> {
  private initialValues: IFormValues;

  public constructor(props: IProps) {
    super(props);

    let { passportFactoryAddress } = props.match.params;

    const queryParams = queryString.parse(props.location.search);

    const startBlock = (queryParams.start_block as string);

    if (!passportFactoryAddress) {
      const { ethNetworkUrl } = getServices();

      switch (ethNetworkUrl) {
        case ethNetworkUrls.mainnet:
          passportFactoryAddress = defaultAddresses.mainnet.factory;
          break;

        case ethNetworkUrls.ropsten:
          passportFactoryAddress = defaultAddresses.ropsten.factory;
          break;
      }
    }

    this.initialValues = {
      factoryAddress: passportFactoryAddress || '',
      startBlock: startBlock || '',
    };
  }

  public render() {
    return (
      <div className='mh-passport-list-form'>
        <Formik<IFormValues>
          initialValues={this.initialValues}
          onSubmit={this.onSubmit}
          validationSchema={validationSchema}
          validateOnChange
        >
          {this.renderForm}
        </Formik>
      </div>
    );
  }

  private renderForm = ({ handleChange, values }) => {
    const { disabled } = this.props;

    return (
      <Form>
        <FormikField
          name='factoryAddress'
        >
          <div className='mh-input-with-button'>
            <TextInput
              name='factoryAddress'
              onChange={handleChange}
              value={values.factoryAddress}
              placeholder={translate(t => t.form.factoryAddress)}
              disabled={disabled}
              className='mh-with-button'
            />
            <SearchButton
              disabled={disabled}
            >
              {translate(t => t.common.load)}
            </SearchButton>
          </div>
        </FormikField>

        <ShowAdvanced>
          <div className='mh-start-block'>
            <FormikField
              name='startBlock'
            >
              <TextInput
                name='startBlock'
                onChange={handleChange}
                value={values.startBlock}
                disabled={disabled}
                placeholder={translate(t => t.form.startBlock)}
              />
            </FormikField>
          </div>
        </ShowAdvanced>
      </Form>
    );
  }

  private onSubmit = (values: IFormValues) => {
    const outputValues: ISubmitValues = {
      factoryAddress: values.factoryAddress.trim().toLowerCase(),
      startBlock: values.startBlock.trim() ? parseInt(values.startBlock, undefined) : null,
    };

    this.props.onSubmit(outputValues);
  }
}

// #endregion

const routed = withRouter(PassportListForm);

export { routed as PassportListForm };
