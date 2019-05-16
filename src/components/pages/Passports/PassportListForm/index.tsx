import { Form, Formik } from 'formik';
import queryString from 'query-string';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button } from 'src/components/form/Button';
import { FormikField } from 'src/components/form/FormikField';
import { TextInput } from 'src/components/form/TextInput';
import { translate } from 'src/i18n';
import * as Yup from 'yup';
import './style.scss';

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

    const { passportFactoryAddress } = props.match.params;

    const queryParams = queryString.parse(props.location.search);

    this.initialValues = {
      factoryAddress: passportFactoryAddress || '',
      startBlock: (queryParams.start_block as string) || '',
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
          label={translate(t => t.form.factoryAddress)}
        >
          <TextInput
            name='factoryAddress'
            onChange={handleChange}
            value={values.factoryAddress}
            placeholder='0x123456...'
            disabled={disabled}
          />
        </FormikField>

        <FormikField
          name='startBlock'
          label={translate(t => t.form.startBlock)}
        >
          <TextInput
            name='startBlock'
            onChange={handleChange}
            value={values.startBlock}
            disabled={disabled}
          />
        </FormikField>

        <div className='mh-form-buttons'>
          <Button
            type='submit'
            disabled={disabled}
          >
            {translate(t => t.common.load)}
          </Button>
        </div>
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
