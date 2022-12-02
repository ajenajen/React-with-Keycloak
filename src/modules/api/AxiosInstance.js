import Axios from 'axios';
import * as AuthService from 'modules/auth/services';

const AXIOS_TIME_OUT = 30000;
const timeRenew = 60;
const project = {
  projectCode: 'IDC2021_trial03',
  projectName: 'IDC2021 trial03'
};

export const axios = Axios.create();

export function setAuthHeaders(axiosInstance) {
  axiosInstance.interceptors.request.use(async (config) => {
    const now = Math.floor(new Date(Date.now()).getTime() / 1000);
    try {
      if (config.method === 'get') {
        config.timeout = AXIOS_TIME_OUT;
      } else {
        config.timeout = 0;
      }

      const iamToken = AuthService.getIamToken();
      const { expIamToken } = AuthService.getCookieExpire();
      // const project = ConfigService.getLocalStoredConfig('selectProject');

      config.headers['iamToken'] = iamToken;

      if (now + timeRenew >= expIamToken) {
        const { iamToken: iamTokenRsp } =
          await AuthService.getIamTokenAuthentication({ project });

        config.headers['iamToken'] = iamTokenRsp;
      }

      return config;
    } catch (e) {
      console.log('SetAuthHeaders error', e);
      return config;
    }
  });
  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const { iamToken: iamTokenRsp } =
              await AuthService.getIamTokenAuthentication({ project });

            axiosInstance.defaults.headers['iamToken'] = iamTokenRsp;

            return axiosInstance(originalConfig);
          } catch (_error) {
            if (_error.response && _error.response.data) {
              return Promise.reject(_error.response.data);
            }

            return Promise.reject(_error);
          }
        }

        if (err.response.status === 403 && err.response.data) {
          return Promise.reject(err.response.data);
        }
      }

      return Promise.reject(err);
    }
  );
}
