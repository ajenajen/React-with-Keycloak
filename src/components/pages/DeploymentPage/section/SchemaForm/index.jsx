import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/core';

function SchemaForm({ values, handleValuesChange }) {
  const handleOnChange = () => {
    console.log('changed');
  };

  return (
    <Form
      schema={values}
      validator={validator}
      onChange={handleOnChange}
      onSubmit={console.log('submitted')}
      onError={console.log('errors')}
    />
  );
}

export default SchemaForm;
