import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../../layout/MainLayout';
import { getClusters } from '../../../modules/cluster/services';

function ClustersPage() {
  const [data, setData] = useState([]);
  const { store } = useSelector((state) => state);
  const currentProject = store.project;

  useEffect(() => {
    // Change to get from localStorage in future
    if (!currentProject.code) {
      window.location.href = '/';
    }

    const fetchData = async () => {
      const { data } = await getClusters();
      data && setData(data?.data);
    };
    fetchData();
  }, [currentProject]);

  return (
    <MainLayout>
      <div>
        <h1>
          Project: {currentProject?.name} ({currentProject?.code})
        </h1>
        <br />
        {data.map((item, index) => (
          <div key={index}>{item.clusterName}</div>
        ))}
      </div>
    </MainLayout>
  );
}

export default ClustersPage;
