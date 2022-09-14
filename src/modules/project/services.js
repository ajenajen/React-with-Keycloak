import Cookies from 'js-cookie';
import { getAPI } from '../../services/APIService';

export const getProjects = async () => {
  const token = Cookies.get('idToken');
  const config = {
    url: process.env.REACT_APP_API_IAM_PATH,
    path: '/v1/projects',
    token
  };

  const { data } = await getAPI(config).catch((e) => {
    console.error(e);

    localStorage.setItem('errorMessage', 'System has a problem get projects');
    window.location = '/error';
  });

  return data;
};
