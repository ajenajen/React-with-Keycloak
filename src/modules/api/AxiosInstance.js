import Axios from 'axios';
import { get, includes } from 'lodash';
import * as AuthService from 'modules/auth/services';

const AXIOS_TIME_OUT = 30000;

export const axios = Axios.create();

export function setAuthHeaders(axiosInstance) {
  axiosInstance.interceptors.request.use((config) => {
    if (config.method === 'get') {
      config.timeout = AXIOS_TIME_OUT;
    } else {
      config.timeout = 0;
    }

    const url = get(config, `url`, '');
    const idToken = AuthService.getIdToken();
    const iamToken = AuthService.getIamToken();

    setHeader();

    function setHeader() {
      if (includes(url, 'tks-apps-backend.dev.nxcp.trueidc')) {
        config.headers['iamToken'] = iamToken;
      }
      if (includes(url, 'tks-iam-authority')) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    }

    return config;
  });
}
