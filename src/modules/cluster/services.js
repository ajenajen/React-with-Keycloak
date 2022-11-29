import { getAPI } from 'modules/api/helper';

export function getClusters({ projectCode }) {
  const url = `${process.env.REACT_APP_API_URL}/clusters`;
  const headers = { projectCode };

  return getAPI({ url, headers })
    .then((response) => {
      return response.data?.length ? response : [];
    })
    .catch((error) => {
      console.error(error?.response);
    });
}
