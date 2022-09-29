import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedStore } from '../../../../_redux/actions/storeActions';
import { getProjects } from '../../../../modules/project/services';

export default function ProjectList() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const { store } = useSelector((state) => state);
  const currentProject = store.project;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getProjects();
      if (data) {
        dispatch(
          setSelectedStore({
            project: {
              name: currentProject?.name || data[0]?.projectName,
              code: currentProject?.code || data[0]?.projectCode
            }
          })
        );
        // set to localStorage
        setData(data);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [currentProject]);

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
    dispatch(
      setSelectedStore({ project: { name: projectName, code: projectCode } })
    );
    navigate(`/${projectCode}/cluster`);
    // eslint-disable-next-line
  }, []);

  return (
    <a
      href="/"
      onClick={handleOnClick}
      style={{ display: 'block', padding: 10, color: '#999' }}
    >
      {projectName}
    </a>
  );
}
