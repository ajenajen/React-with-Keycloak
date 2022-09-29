import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

import MainLayout from '../../../../../layout/MainLayout';
import schema from '../../../../../data/kubeapp/values.schema.json';
import values from '../../data/kubeapp/values.yml';
import { retrieveBasicFormParams } from './utils';
import Param from '../../../Param';

function SchemaPage() {
  const [basicFormParameters, setBasicFormParameters] = useState([]);
  const [defaultValues, setDefaultValues] = useState('');
  // const [appValues, setAppValues] = useState(values || '');
  console.log('schema properties', schema.properties);

  useEffect(() => {
    const params = retrieveBasicFormParams(defaultValues, schema);
    if (!isEqual(params, basicFormParameters)) {
      setBasicFormParameters(params);
    }
  }, [setBasicFormParameters, schema, defaultValues]);

  useEffect(() => {
    setDefaultValues(values || '');
  }, [values]);

  // const handleValuesChange = (value) => {
  //   setAppValues(value);
  // };

  console.log('shema params', basicFormParameters);

  return (
    <MainLayout>
      <div className="deployment-form-tabs-data">
        {basicFormParameters.map((param, i) => {
          const id = `${param.path}-${i}`;
          return (
            <div key={id}>
              <Param
                // deploymentEvent={deploymentEvent}
                // handleBasicFormParamChange={handleBasicFormParamChange}
                // handleValuesChange={handleValuesChange}
                allParams={basicFormParameters}
                param={param}
                id={id}
              />
              <hr className="param-separator" />
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}

export default SchemaPage;
