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
import { Grid, Row, Col } from 'react-flexbox-grid';
import { IGetPassportOwnerPayload } from 'src/state/passport/actions';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends RouteComponentProps<any> {
  onSubmit(values: ISubmitValues);
  onLoadPassportOwnerAddress(address: IGetPassportOwnerPayload);
  disabled: boolean;
}

interface IFormValues {
  passportAddress: string;
  startBlock: string;
  factProvider: string;
}

export interface ISubmitValues {
  passportAddress: string;
  startBlock: number;
  factProviderAddress: string;
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

    this.initialValues = {
      passportAddress: passportAddress || '',
      startBlock: startBlock || '',
      factProvider: factProvider || '',
    };
  }

  public componentDidMount() {
    if (this.initialValues.passportAddress) {
      this.onSubmit(this.initialValues);
      this.props.onLoadPassportOwnerAddress({
        passportAddress: this.initialValues.passportAddress,
      });
    }
  }

  public render() {
    return (
      <Grid>
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
      </Grid>
    );
  }

  private renderForm = ({ handleChange, values }) => {
    const { disabled } = this.props;

    return (
      <Form>
        <Row>
          <Col xs={12} md={4} className='col'>
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
          </Col>

          <Col xs={12} md={2} className='col'>
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
          </Col>

          <Col xs={12} md={4} className='col'>
            <FormikField
              name='factProvider'
              label={translate(t => t.passport.factProviderAddress)}
            >
              <TextInput
                name='factProvider'
                onChange={handleChange}
                value={values.factProvider}
                disabled={disabled}
              />
            </FormikField>
          </Col>

          <Col xs={12} md={2} className='col'>
            <div className='mh-form-buttons'>
              <Button
                type='submit'
                disabled={disabled}
              >
                {translate(t => t.common.load)}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  private onSubmit = (values: IFormValues) => {
    const outputValues: ISubmitValues = {
      passportAddress: values.passportAddress.trim().toLowerCase(),
      startBlock: values.startBlock.trim() ? parseInt(values.startBlock, undefined) : null,
      factProviderAddress: values.factProvider.trim().toLowerCase(),
    };

    this.props.onSubmit(outputValues);
  }
}

// #endregion

const routed = withRouter(FactsListForm);

export { routed as FactsListForm };
