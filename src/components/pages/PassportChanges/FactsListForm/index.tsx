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
  passportAddress: string;
  startBlock: string;
}

export interface ISubmitValues {
  passportAddress: string;
  startBlock: number;
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

    this.initialValues = {
      passportAddress: passportAddress || '',
      startBlock: startBlock || '',
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
          label={translate(t => t.form.passportAddress)}
        >
          <TextInput
            name='passportAddress'
            onChange={handleChange}
            value={values.passportAddress}
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
      passportAddress: values.passportAddress.trim().toLowerCase(),
      startBlock: values.startBlock.trim() ? parseInt(values.startBlock, undefined) : null,
    };

    this.props.onSubmit(outputValues);
  }
}

// #endregion

const routed = withRouter(FactsListForm);

export { routed as FactsListForm };
