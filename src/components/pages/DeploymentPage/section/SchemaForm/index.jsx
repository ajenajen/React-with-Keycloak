import shemaData from '../../../../data/redis/values.schema.json';
import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/core';

function SchemaForm() {
  return (
    <Form
      schema={shemaData}
      validator={validator}
      onChange={console.log('changed')}
      onSubmit={console.log('submitted')}
      onError={console.log('errors')}
    />
  );
}

export default SchemaForm;
