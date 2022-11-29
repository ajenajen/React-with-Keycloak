import { axios } from './AxiosInstance';

export async function getAPI({ url, params, options, headers }) {
  const { data } = await axios.get(url, {
    params,
    headers,
    ...options
  });

  return data;
}
export async function postAPI({ url, params, options, body, headers }) {
  const { data } = await axios.post(url, body, {
    params,
    headers,
    ...options
  });

  return data;
}

export async function updateAPI({ url, params, options, body }) {
  const { data } = await axios.put(url, {
    headers: params,
    data: body,
    ...options
  });

  return data;
}
