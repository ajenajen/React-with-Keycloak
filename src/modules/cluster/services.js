import { getAPI } from '../../services/APIService';
import Cookies from 'js-cookie';

export const getClusters = async () => {
  const token = Cookies.get('idToken');
  const config = {
    path: '/v1/iam/clusters',
    token
  };

  const result = await getAPI(config).catch((e) => {
    console.error(e);

    localStorage.setItem('errorMessage', 'System has a problem get clusters');
    window.location = '/error';
  });

  return result;
};
