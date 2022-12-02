import { axiosWithToken } from 'modules/auth/apiService';

export const getUserProjects = async () => {
  const options = {
    method: 'POST',
    url: `${process.env.REACT_APP_IAM_URL}/get-user-accounts`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: { roles: ['g::_sys/tks-apps/user'] }
  };

  return axiosWithToken
    .request(options)
    .then(({ data }) => {
      const result = data.data;

      return result || [];
    })
    .catch((e) => {
      console.error('getUserProjects', e);
    });
};
