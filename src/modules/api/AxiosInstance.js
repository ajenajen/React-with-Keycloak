import Axios from 'axios';
import * as AuthService from 'modules/auth/services';

const AXIOS_TIME_OUT = 30000;
const timeRenew = 60;

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

      let iamToken = AuthService.getIamToken();
      const { expIamToken } = AuthService.getCookieExpire();
      // const project = ConfigService.getLocalStoredConfig('selectProject');
      const project = {
        projectCode: 'IDC2021_trial03',
        projectName: 'IDC2021 trial03'
      };

      if (now + timeRenew >= expIamToken) {
        const { iamToken: iamTokenRsp } =
          await AuthService.getIamTokenAuthentication({ project });

        config.headers['iamToken'] = iamTokenRsp;
      }
      config.headers['iamToken'] = iamToken;

      return config;
    } catch (e) {
      console.log('SetAuthHeaders error', e);
      return config;
    }
  });
}
