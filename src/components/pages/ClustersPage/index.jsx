import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import { getClusters } from 'modules/cluster/services';

function ClustersPage() {
  const [data, setData] = useState([]);
  const { pCode } = useParams();
  const projectCode = pCode;

  useEffect(() => {
    const fetchData = async () => {
      const response = await getClusters({ projectCode });
      response?.data && setData(response.data);
    };
    fetchData();
  }, [projectCode]);

  return (
    <MainLayout>
      <div>
        <h1>Project: {projectCode}</h1>
        <br />
        {data.map((item, index) => (
          <div key={index}>{item.cluster_name}</div>
        ))}
      </div>
    </MainLayout>
  );
}

export default ClustersPage;
