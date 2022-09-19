import Cookies from 'js-cookie';
import { getAPI } from '../../services/APIService';

export const getClusters = async () => {
  const iamToken = Cookies.get('iamToken');
  const config = {
    path: '/v1/iam/clusters',
    headers: { authorization: `Bearer ${iamToken}` }
  };

  const result = await getAPI(config).catch((e) => {
    console.error(e);

    localStorage.setItem('errorMessage', 'System has a problem get clusters');
    // window.location = '/error';
  });

  return result;
};
