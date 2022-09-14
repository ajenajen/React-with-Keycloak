import axios from 'axios';

const defaultTimeout = 10000;

export function getAPI({
  url = process.env.REACT_APP_API_MASTER_PATH,
  path,
  data,
  token,
  timeout = defaultTimeout,
  ...options
}) {
  return axios({
    baseURL: `${url}${path}`,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    },
    data,
    timeout,
    ...options
  }).then((response) => response);
}

export function postAPI({
  url = process.env.REACT_APP_API_MASTER_PATH,
  path,
  data,
  token,
  timeout = defaultTimeout,
  ...options
}) {
  return axios({
    method: 'post',
    url: `${url}${path}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    data,
    timeout,
    ...options
  }).then((response) => response);
}

export function putAPI({
  url = process.env.REACT_APP_API_MASTER_PATH,
  path,
  data,
  token,
  timeout = defaultTimeout,
  ...options
}) {
  return axios({
    method: 'put',
    url: `${url}${path}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    data,
    timeout,
    ...options
  }).then((response) => response);
}

export function throwError(status = 500, { errorCode = '' } = {}) {
  const err = new Error();
  err.response = { status, errorCode };
  throw err;
}
