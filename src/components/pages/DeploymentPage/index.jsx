import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import MainLayout from '../../layout/MainLayout';
import SchemaForm from './section/SchemaForm';
import YamlForm from './section/YamlForm';

import { initSelected } from './data';

export default function DeploymentPage() {
  const {
    availablePackageDetail,
    versions,
    schema,
    values,
    pkgVersion,
    error
  } = initSelected;
  const [value, setValues] = useState(values || '');
  const [valuesModified, setValuesModified] = useState(false);
  console.log('deployment value: ', value);

  useEffect(() => {
    if (!valuesModified) {
      setValues(values || '');
    }
    return () => {};
  }, [valuesModified]);

  const handleValuesChange = () => {
    setValues(value);
    setValuesModified(true);
  };

  return (
    <MainLayout>
      <Tabs>
        <TabList>
          <Tab>Form</Tab>
          <Tab>Yaml</Tab>
          <Tab>Changes</Tab>
        </TabList>

        <TabPanel>
          <SchemaForm values={schema} handleValuesChange={handleValuesChange} />
        </TabPanel>
        <TabPanel>
          <YamlForm values={value} handleValuesChange={handleValuesChange} />
        </TabPanel>
        <TabPanel>
          <h2>Changes</h2>
        </TabPanel>
      </Tabs>
    </MainLayout>
  );
}
