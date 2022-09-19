import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../../../../modules/project/services';

export default function ProjectList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getProjects();
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <>
      {data.map((item, index) => (
        <ProjectListItem key={index} data={item} />
      ))}
    </>
  );
}

function ProjectListItem({ data }) {
  const { projectCode, projectName } = data;
  const handleOnClick = useCallback((e) => {
    e.preventDefault();
    console.log(projectCode);
  }, []);

  return (
    <a
      href="#"
      onClick={handleOnClick}
      style={{ display: 'block', padding: 10, color: '#999' }}
    >
      {projectName}
    </a>
  );
}
