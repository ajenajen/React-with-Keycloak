import { useSelector } from 'react-redux';
import MainLayout from '../../layout/MainLayout';

function ClustersPage() {
  const { store } = useSelector((state) => state);
  const currentProject = store.project;

  return (
    <MainLayout>
      <div style={{ textAlign: 'center' }}>
        <h1>Project: {currentProject}</h1>
        <br />
        <h2>ClustersPage</h2>
      </div>
    </MainLayout>
  );
}

export default ClustersPage;
