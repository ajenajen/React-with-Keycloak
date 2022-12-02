import Axios from 'axios';
import * as AuthService from 'modules/auth/services';

const timeRenew = 60;
export const axios = Axios.create();
export const axiosWithToken = Axios.create();

axiosWithToken.interceptors.request.use(async (config) => {
  const now = Math.floor(new Date(Date.now()).getTime() / 1000);
  try {
    let idToken = AuthService.getIdToken();
    const { expIdToken } = AuthService.getCookieExpire();

    if (!idToken || now + timeRenew >= expIdToken) {
      console.log('renew idToken');
      const { id_token: idTokenRsp } =
        await AuthService.updateAuthorizationToken({
          pathname: undefined
        });
      idToken = idTokenRsp;
    }

    config.headers.authorization = `Bearer ${idToken}`;

    return config;
  } catch (e) {
    console.log('axiosWithToken error', e);
    return config;
  }
});
