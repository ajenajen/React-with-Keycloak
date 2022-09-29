import MainLayout from '../../layout/MainLayout';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import SchemaForm from './section/SchemaForm';

export default function DeploymentPage() {
  return (
    <MainLayout>
      <Tabs>
        <TabList>
          <Tab>Form</Tab>
          <Tab>Yaml</Tab>
          <Tab>Changes</Tab>
        </TabList>

        <TabPanel>
          <SchemaForm />
        </TabPanel>
        <TabPanel>
          <h2>Yaml</h2>
        </TabPanel>
        <TabPanel>
          <h2>Changes</h2>
        </TabPanel>
      </Tabs>
    </MainLayout>
  );
}
