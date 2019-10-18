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
import { SearchButton } from 'src/components/form/SearchButton';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends RouteComponentProps<any> {
  onSubmit(values: ISubmitValues);
  disabled: boolean;
}

interface IFormValues {
  passportAddress: string;
  startBlock: string;
  factProvider: string;
  factKey?: string;
}

export interface ISubmitValues {
  passportAddress: string;
  startBlock: number;
  factProviderAddress: string;
  factKey?: string;
}

// #endregion

// #region -------------- Form validation schema -------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  passportAddress: Yup.string()
    .trim()
    .required(translate(t => t.errors.required))
    .length(42, translate(t => t.errors.mustBeNCharsLengths, { length: '${length}' }))
    .matches(/^0x[a-f0-9]+$/i, translate(t => t.errors.invalidAddress)),
  startBlock: Yup.number()
    .typeError(translate(t => t.errors.mustBeNumber))
    .notRequired()
    .positive(translate(t => t.errors.mustBePositiveNumber))
    .integer(translate(t => t.errors.mustBeWholeNumber)),
  factProvider: Yup.string()
    .trim()
    .notRequired()
    .length(42, translate(t => t.errors.mustBeNCharsLengths, { length: '${length}' }))
    .matches(/^0x[a-f0-9]+$/i, translate(t => t.errors.invalidAddress)),
});

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class FactsListForm extends React.PureComponent<IProps> {
  private initialValues: IFormValues;

  public constructor(props: IProps) {
    super(props);

    const { passportAddress } = props.match.params;

    const queryParams = queryString.parse(props.location.search);

    const startBlock = (queryParams.start_block as string);
    const factProvider = (queryParams.fact_provider as string);
    const factKey = (queryParams.fact_key as string);

    this.initialValues = {
      passportAddress: passportAddress || '',
      startBlock: startBlock || '',
      factProvider: factProvider || '',
      factKey: factKey || '',
    };
  }

  public componentDidMount() {
    if (this.initialValues.passportAddress) {
      this.onSubmit(this.initialValues);
    }
  }

  public render() {
    return (
      <div className='mh-facts-form'>
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
          name='passportAddress'
        >
          <div className='mh-input-with-button'>
            <TextInput
              name='passportAddress'
              onChange={handleChange}
              value={values.passportAddress}
              placeholder='0x123456...'
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

          <FormikField
            name='factProvider'
          >
            <TextInput
              name='factProvider'
              onChange={handleChange}
              value={values.factProvider}
              disabled={disabled}
              placeholder={translate(t => t.passport.factProviderAddress)}
              className='mh-fact-provider-address'
            />
          </FormikField>
        </ShowAdvanced>
      </Form>
    );
  }

  private onSubmit = (values: IFormValues) => {
    const outputValues: ISubmitValues = {
      passportAddress: values.passportAddress.trim().toLowerCase(),
      startBlock: values.startBlock.trim() ? parseInt(values.startBlock, undefined) : null,
      factProviderAddress: values.factProvider.trim().toLowerCase(),
      factKey: values.factKey && values.factKey.trim().toLowerCase(),
    };

    this.props.onSubmit(outputValues);
  }
}

// #endregion

const routed = withRouter(FactsListForm);

export { routed as FactsListForm };
