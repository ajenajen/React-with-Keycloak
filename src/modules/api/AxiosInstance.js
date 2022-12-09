import Axios from 'axios';
import _ from 'lodash';
import { Mutex } from 'async-mutex';
import * as AuthService from 'modules/auth/services';

const AXIOS_TIME_OUT = 30000;
const timeRenew = 60;
const project = {
  projectCode: 'IDC2021_trial03',
  projectName: 'IDC2021 trial03'
};

function setHeader(config, idToken, iamToken) {
  const url = _.get(config, `url`, '');

  if (_.includes(url, process.env.REACT_APP_IAM_URL)) {
    config.headers.authorization = `Bearer ${idToken}`;
  } else {
    config.headers['iamToken'] = iamToken;
  }

  return config;
}

export function setAuthHeaders(axiosInstance) {
  let clientLock = new Mutex();
  axiosInstance.interceptors.request.use(async (config) => {
    const now = Math.floor(new Date(Date.now()).getTime() / 1000);
    try {
      if (config.method === 'get') {
        config.timeout = AXIOS_TIME_OUT;
      } else {
        config.timeout = 0;
      }

      let idToken = AuthService.getIdToken();
      let iamToken = AuthService.getIamToken();
      // const project = ConfigService.getLocalStoredConfig('selectProject');
      const { expIdToken, expIamToken } = AuthService.getCookieExpire();

      let release = await clientLock.acquire();
      if (now + timeRenew >= expIdToken) {
        AuthService.updateAuthorizationToken({
          pathname: undefined
        }).then(({ id_token }) => {
          AuthService.removeIamToken();
          AuthService.getIamTokenAuthentication({
            project,
            headers: {
              authorization: `Bearer ${id_token}`
            }
          }).then(({ iamToken: iamTokenRsp }) => {
            idToken = id_token;
            iamToken = iamTokenRsp;
          });
        });
      } else if (now + timeRenew >= expIamToken) {
        AuthService.removeIamToken();
        AuthService.getIamTokenAuthentication({
          project,
          headers: {
            authorization: `Bearer ${idToken}`
          }
        }).then(({ iamToken: iamTokenRsp }) => {
          iamToken = iamTokenRsp;
        });
      }
      release();
      setHeader(config, idToken, iamToken);

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

export const axios = Axios.create();
export const axiosWithAuth = Axios.create();
