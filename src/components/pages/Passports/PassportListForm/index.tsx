import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ErrorMessage, Form, Formik } from 'formik';
import { Label } from 'src/components/text/Label';
import { TextInput } from 'src/components/form/TextInput';
import queryString from 'query-string';

// #region -------------- Interfaces --------------------------------------------------------------

export interface IProps extends RouteComponentProps<any> {
}

interface IFormValues {
  factoryAddress: string;
  startBlock: string;
}

// #endregion

// #region -------------- Component ---------------------------------------------------------------

class PassportListForm extends React.PureComponent<IProps> {
  private initialValues: IFormValues;
  private setFieldValue;

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
        >
          {this.renderForm}
        </Formik>
      </div>
    );
  }

  private renderForm = ({ setFieldValue, values }) => {
    this.setFieldValue = setFieldValue;

    return (
      <Form>
        <div>
          <Label>Passport factory address</Label>
          <TextInput
            name='factoryAddress'
            onChange={this.onFactoryAddressChange}
            value={values.factoryAddress}
          />
          <ErrorMessage name='factoryAddress' component='div' />
        </div>

        <div>
          <Label>Start block</Label>
          <TextInput
            name='startBlock'
            onChange={this.onStartBlockChange}
            value={values.startBlock}
          />
          <ErrorMessage name='startBlock' component='div' />
        </div>
      </Form>
    );
  }

  private onFactoryAddressChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    this.setFieldValue('factoryAddress', value.currentTarget.value);
  }

  private onStartBlockChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    this.setFieldValue('startBlock', value.currentTarget.value);
  }

  private onSubmit = () => {

  }
}

// #endregion

const routed = withRouter(PassportListForm);

export { routed as PassportListForm };
