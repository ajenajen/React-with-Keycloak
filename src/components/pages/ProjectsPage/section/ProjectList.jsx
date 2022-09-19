import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentProject } from '../../../../_redux/actions/storeActions';
import { getProjects } from '../../../../modules/project/services';

export default function ProjectList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getProjects();
      setCurrentProject(data[0]?.projectCode);
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectCode, projectName } = data;

  const handleOnClick = useCallback((e) => {
    e.preventDefault();
    dispatch(setCurrentProject(projectCode));
    navigate('/cluster');
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
