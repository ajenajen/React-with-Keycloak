/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import MainLayout from '../../layout/MainLayout';
import SchemaForm from './section/SchemaForm';
import YamlForm from './section/YamlForm';
import DifferentialForm from './section/DifferentialForm';

import { initSelected } from './data';
import {
  retrieveBasicFormParams,
  parseValues,
  setYamlValue,
  getValueFromEvent
} from './utils';

export default function DeploymentPage() {
  const [defaultValues, setDefaultValues] = useState('');
  const [appValues, setAppValues] = useState('');
  const [basicFormParameters, setBasicFormParameters] = useState([]);
  const [valuesModified, setValuesModified] = useState(false);
  const [deployedValues, setDeployedValues] = useState('');
  const deploymentEvent = 'install';

  const {
    availablePackageDetail: { name, homeUrl },
    schema,
    values,
    appVersion,
    pkgVersion
  } = initSelected;

  useEffect(() => {
    setDefaultValues(values || '');
  }, [values]);

  useEffect(() => {
    const params = retrieveBasicFormParams(appValues, schema);
    if (!isEqual(params, basicFormParameters)) {
      setBasicFormParameters(params);
    }
  }, [schema, basicFormParameters, appValues]);

  const handleValuesChange = (value) => {
    setAppValues(value);
    setValuesModified(true);
  };

  useEffect(() => {
    if (!valuesModified) {
      setAppValues(initSelected.values || '');
    }
    return () => {};
  }, [valuesModified]);

  const handleBasicFormParamChange = (param) => {
    const parsedDefaultValues = parseValues(defaultValues);

    console.log('handleBasicFormParamChange param', param);
    return (e) => {
      setValuesModified(true);
      if (parsedDefaultValues !== defaultValues) {
        setDefaultValues(parsedDefaultValues);
      }
      const value = getValueFromEvent(e);

      setBasicFormParameters(
        basicFormParameters.map((p) =>
          p.path === param.path ? { ...param, value } : p
        )
      );
      // Change raw values
      setAppValues(setYamlValue(appValues, param.path, value));
    };
  };

  const restoreDefaultValues = () => {
    if (values) {
      setAppValues(values);
      setBasicFormParameters(retrieveBasicFormParams(values, schema));
    }
    // setRestoreModalOpen(false);
  };

  const setValuesModifiedTrue = () => setValuesModified(true);

  return (
    <MainLayout>
      <div
        css={{
          display: 'flex',
          flexWrap: 'wrap',
          lineHeight: 1.8
        }}
      >
        <div
          css={{
            flex: '0 0 calc(25% - 30px)',
            paddingRight: 30,
            maxWidth: 'calc(25% - 30px)'
          }}
        >
          <h1 css={{ fontSize: '2em', marginBottom: 10 }}>{name}</h1>
          URL:{' '}
          <a css={{ wordBreak: 'break-word' }} href={homeUrl}>
            {homeUrl}
          </a>
          <br />
          App Version: {appVersion} <br />
          Package Version: {pkgVersion} <br />
        </div>
        <div css={{ flex: '0 0 75%', maxWidth: '75%' }}>
          <Tabs>
            <TabList>
              <Tab>Form</Tab>
              <Tab>Yaml</Tab>
              <Tab>Changes</Tab>
            </TabList>

            <TabPanel>
              <SchemaForm
                deploymentEvent={deploymentEvent}
                params={basicFormParameters}
                handleBasicFormParamChange={handleBasicFormParamChange}
                appValues={appValues}
                handleValuesChange={handleValuesChange}
              />
            </TabPanel>
            <TabPanel>
              <YamlForm
                appValues={appValues}
                handleValuesChange={handleValuesChange}
              />
            </TabPanel>
            <TabPanel>
              <DifferentialForm
                deploymentEvent={deploymentEvent}
                defaultValues={defaultValues}
                deployedValues={deployedValues || ''}
                appValues={appValues}
                setValuesModified={setValuesModifiedTrue}
              />
            </TabPanel>
          </Tabs>
          <div>
            <button
              className="btn btn-danger"
              type="submit"
              onClick={restoreDefaultValues}
            >
              Restore default
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
