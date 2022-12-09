import Cookies from 'js-cookie';
import queryString from 'query-string';
import jwt_decode from 'jwt-decode';
import { axios, axiosWithAuth } from 'modules/api/AxiosInstance';

import {
  ID_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  IAM_TOKEN_NAME,
  ACCESS_TOKEN_NAME,
  authorizationUrl,
  accessTokenUrl,
  logoutUrl
} from './configs';

const domain = process.env.REACT_APP_MAIN_URL;
const CookiesWithDomain = Cookies.withAttributes({
  path: '/',
  domain,
  httpOnly: false
});

export const AXIOS_TIME_OUT = 30000;
export const TIME_RENEW = 60;

export function setAccessToken(token) {
  CookiesWithDomain.set(ACCESS_TOKEN_NAME, token);
}

export function setIdToken(token) {
  CookiesWithDomain.set(ID_TOKEN_NAME, token);
}

export function setRefreshToken(token) {
  let date = new Date(Date.now() + 25200000);
  date.setDate(date.getDate() + 7);

  CookiesWithDomain.set(REFRESH_TOKEN_NAME, token, {
    expires: date,
    httpOnly: false
  });
}

export function setIamToken(token) {
  CookiesWithDomain.set(IAM_TOKEN_NAME, token);
}

export function getIdToken() {
  return CookiesWithDomain.get(ID_TOKEN_NAME);
}

export function getRefreshToken() {
  return CookiesWithDomain.get(REFRESH_TOKEN_NAME);
}

export function getIamToken() {
  return CookiesWithDomain.get(IAM_TOKEN_NAME);
}

export function getAccessToken() {
  return CookiesWithDomain.get(ACCESS_TOKEN_NAME);
}

export function removeIamToken() {
  return CookiesWithDomain.remove(IAM_TOKEN_NAME);
}

function removeStoredDoingLogin() {
  return localStorage.removeItem('doingLogin');
}

export function clearAllCookies() {
  CookiesWithDomain.remove(ID_TOKEN_NAME);
  CookiesWithDomain.remove(REFRESH_TOKEN_NAME);
  CookiesWithDomain.remove(IAM_TOKEN_NAME);
  CookiesWithDomain.remove(ACCESS_TOKEN_NAME);
  removeStoredDoingLogin();
}

export function getTokenLogin() {
  const idToken = getIdToken();
  const refreshToken = getRefreshToken();

  return refreshToken !== undefined && idToken !== undefined;
}

export function doLogin({ currentPathname = '/' }) {
  const queryParam = queryString.stringify({
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    redirect_uri: `${process.env.REACT_APP_REDIRECT_URL}${currentPathname}`,
    scope: 'openid'
  });

  window.location.href = `${authorizationUrl}${queryParam}`;
}

export function doLogout({ currentPathname }) {
  const redirectPathname = currentPathname || window.location.pathname;
  const refreshToken = getRefreshToken();
  const redirectURI = `?redirect_uri=${process.env.REACT_APP_REDIRECT_URL}${redirectPathname}`;
  const url = `${logoutUrl}${redirectURI}`;

  const data = {
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    client_secret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET,
    refresh_token: refreshToken
  };

  const options = {
    method: 'POST',
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: queryString.stringify(data)
  };

  if (refreshToken) {
    axios(options)
      .then((response) => {
        clearAllCookies();
        window.location.replace(redirectPathname);

        return response;
      })
      .catch((e) => {
        clearAllCookies();
        console.error(e);
      });
  } else {
    clearAllCookies();
    window.location.replace(redirectPathname);
  }
}

export function handleAuthenticationCallback({ code, pathname }) {
  return accessTokenAuthentication({ code, pathname });
}

export function accessTokenAuthentication({ code = '', pathname = '/' }) {
  const data = {
    grant_type: 'authorization_code',
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    client_secret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET,
    redirect_uri: `${process.env.REACT_APP_REDIRECT_URL}${pathname}`,
    code
  };

  const options = {
    method: 'POST',
    url: accessTokenUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: queryString.stringify(data)
  };

  return axios(options)
    .then(({ data }) => {
      const { id_token, refresh_token, access_token } = data;

      removeStoredDoingLogin();
      setIdToken(id_token);
      setRefreshToken(refresh_token);
      setAccessToken(access_token);

      return data;
    })
    .catch((e) => {
      removeStoredDoingLogin();
      console.error(e);
    });
}

export function getIamTokenAuthentication({ project }) {
  const options = {
    method: 'POST',
    url: `${process.env.REACT_APP_IAM_URL}/iam`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: { domain: `${project?.projectCode}/th`, scope: ['tks-apps'] }
  };

  return axiosWithAuth
    .request(options)
    .then(({ data }) => {
      console.log('getIamTokenAuthentication', data);
      const { iamtoken } = data;
      setIamToken(iamtoken);

      return data;
    })
    .catch((e) => {
      console.error(e);
    });
}

export function getCookieExpire() {
  const idToken = getIdToken();
  const iamToken = getIamToken();
  const expIdToken = idToken && jwt_decode(idToken).exp;
  const expIamToken = iamToken && jwt_decode(iamToken).exp;
  return {
    expIdToken,
    expIamToken
  };
}

export async function checkCookieAuthentication({ pathname, selectProject }) {
  const refreshToken = getRefreshToken();
  const idToken = getIdToken();
  const { expIdToken } = getCookieExpire();

  let isCookieAuthentication = false;
  const now = Math.floor(new Date(Date.now()).getTime() / 1000);
  const noTokenCookies = idToken === undefined || refreshToken === undefined;

  if (refreshToken === undefined) {
    isCookieAuthentication = false;
  }

  try {
    if (idToken !== undefined && refreshToken !== undefined) {
      if (now > expIdToken) {
        isCookieAuthentication = false;
        doLogout({ currentPathname: pathname });
      }

      isCookieAuthentication = true;
    } else if (noTokenCookies) {
      isCookieAuthentication = false;
    }
  } catch (error) {
    console.error('checkCookieAuthentication', error);
    isCookieAuthentication = false;
  }

  return isCookieAuthentication;
}

export function updateAuthorizationToken({ pathname }) {
  const refreshToken = getRefreshToken();
  const data = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
  };

  const options = {
    method: 'POST',
    url: accessTokenUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: queryString.stringify(data)
  };

  return axios(options)
    .then((response) => {
      const { id_token, refresh_token, access_token } = response?.data;

      setIdToken(id_token);
      setRefreshToken(refresh_token);
      setAccessToken(access_token);

      console.log('updateAuthorizationToken success');
      return response?.data;
    })
    .catch((e) => {
      console.log('updateAuthorizationToken failed');
      console.error(e);
      doLogout({ currentPathname: pathname });
    });
}

export function decodeUserData(data) {
  const result = jwt_decode(data);
  const { name, email } = result;

  return { name, email };
}
