import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'stores/store';
import { useNavigate } from 'react-router-dom';
import { setSelectedStore } from 'stores/actions/storeActions';
import { getUserProjects } from 'modules/project/services';

export default function ProjectList() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState([]);
  const { store } = useAppSelector((state) => state);
  const currentProject = store.project;

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserProjects();

      if (response) {
        dispatch(
          setSelectedStore({
            project: {
              name: currentProject?.name || response[0]?.projectName,
              code: currentProject?.code || response[0]?.projectCode
            }
          })
        );
        setData(response);
      }
    };
    fetchData();
  }, [currentProject?.code, currentProject?.name, dispatch]);

  return (
    <>
      {data.map((item, index) => (
        <ProjectListItem key={index} data={item} />
      ))}
    </>
  );
}

function ProjectListItem({ data }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projectCode, projectName } = data;

  const handleOnClick = useCallback((e) => {
    e.preventDefault();
    dispatch(
      setSelectedStore({ project: { name: projectName, code: projectCode } })
    );
    navigate(`/project/${projectCode}`);
    // eslint-disable-next-line
  }, []);

  return (
    <a
      href="/#"
      onClick={handleOnClick}
      style={{ display: 'block', padding: 10, color: '#999' }}
    >
      {projectCode} : {projectName}
    </a>
  );
}
