import Cookies from 'js-cookie';
import axios from 'axios';

export const getUserProjects = async () => {
  const idToken = Cookies.get('idToken');
  const options = {
    method: 'POST',
    url: `${process.env.REACT_APP_IAM_URL}/get-user-accounts`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    },
    data: { roles: ['g::_sys/tks-apps/user'] }
  };

  return axios
    .request(options)
    .then(({ data }) => {
      const result = data.data;

      return result || [];
    })
    .catch((e) => {
      console.error('getUserProjects', e);
    });
};
