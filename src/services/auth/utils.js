import axios from 'axios';
import Cookies from 'js-cookie';
import queryString from 'query-string';
import jwt_decode from 'jwt-decode';

import {
  ID_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  IAM_TOKEN_NAME,
  ACCESS_TOKEN_NAME,
  authorizationUrl,
  accessTokenUrl,
  logoutUrl
} from './configs';

export function setAccessToken(token) {
  Cookies.set(ACCESS_TOKEN_NAME, token, { httpOnly: false });
}

export function setIdToken(token) {
  Cookies.set(ID_TOKEN_NAME, token, { httpOnly: false });
}

export function setRefreshToken(token) {
  let date = new Date(Date.now() + 25200000);
  date.setDate(date.getDate() + 7);

  Cookies.set(REFRESH_TOKEN_NAME, token, {
    expires: date,
    httpOnly: false
  });
}

export function setIamToken(token) {
  Cookies.set(IAM_TOKEN_NAME, token, { httpOnly: false });
}

export function getIdToken() {
  return Cookies.get(ID_TOKEN_NAME);
}

export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN_NAME);
}

export function getIamToken() {
  return Cookies.get(IAM_TOKEN_NAME);
}

export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN_NAME);
}

export function clearAllCookies() {
  Cookies.remove(ID_TOKEN_NAME, { path: '' });
  Cookies.remove(REFRESH_TOKEN_NAME, { path: '' });
  Cookies.remove(IAM_TOKEN_NAME, { path: '' });
}

export function doLogin({ pathname = '/' }) {
  const queryParam = queryString.stringify({
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: `${process.env.REACT_APP_REDIRECT_URL}${pathname}`,
    scope: 'openid'
  });

  window.location.href = `${authorizationUrl}${queryParam}`;
}

export async function doLogout({ pathname = '/' }) {
  const data = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    refresh_token: getRefreshToken()
  };

  const options = {
    method: 'POST',
    url: logoutUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: queryString.stringify(data)
  };

  await axios(options)
    .then((response) => {
      clearAllCookies();

      window.location.replace(pathname);
    })
    .catch((e) => console.error(e));
}

export function handleAuthenticationCallback({ code, pathname }) {
  accessTokenAuthentication({ code, pathname });
}

function axiosAuthenticationToken({ options, pathname }) {
  return axios(options)
    .then((response) => {
      const { id_token, refresh_token, access_token } = response?.data;

      setIdToken(id_token);
      setRefreshToken(refresh_token);
      setAccessToken(access_token);
    })
    .then(() => {
      window.location.replace(pathname);
    })
    .catch((e) => console.error(e));
}

export async function accessTokenAuthentication({ code = '', pathname = '/' }) {
  const data = {
    grant_type: 'authorization_code',
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
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

  await axiosAuthenticationToken({ options, pathname });
}

export async function iamTokenAuthentication(project = 'IDC2021_trial03') {
  const defaultData = {
    iamToken: undefined,
    k8sToken: undefined
  };

  const idToken = getIdToken();

  if (project !== '' || project !== null) {
    const option = {
      method: 'GET',
      url: `${process.env.REACT_APP_API_IAM_PATH}/v1/iamtoken?projectCode=${project}`,
      headers: { authorization: `Bearer ${idToken}` }
    };

    await axios(option)
      .then(({ data: result }) => {
        const { iamToken } = result; //k8sToken
        setIamToken(iamToken);
      })
      .catch((e) => {
        console.error(e);
        return defaultData;
      });
  }
}

export async function checkCookieAuthentication({ pathname }) {
  let isCookieAuthentication = false;
  const idToken = getIdToken();
  const refreshToken = getRefreshToken();

  const noTokenCookies = idToken === undefined || refreshToken === undefined;

  if (refreshToken === undefined) {
    isCookieAuthentication = false;
  }
  try {
    if (refreshToken !== undefined && idToken !== undefined) {
      const decoded = jwt_decode(idToken);

      if (Date.now() > decoded.exp * 1000) {
        updateAuthorizationToken({ pathname });
      }

      isCookieAuthentication = true;
    } else if (idToken === undefined || noTokenCookies) {
      await doLogout();
      isCookieAuthentication = false;
    }
  } catch (error) {
    console.error(error);
    isCookieAuthentication = false;
  }

  return isCookieAuthentication;
}

export async function updateAuthorizationToken({ pathname = '/' }) {
  const accessToken = getAccessToken();
  const data = {
    grant_type: 'refresh_token',
    client_id: process.env.REACT_APP_CLIENT_ID,
    refresh_token: getRefreshToken()
  };

  const options = {
    method: 'POST',
    url: accessTokenUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: `Bearer ${accessToken}`
    },
    data: queryString.stringify(data)
  };

  await axiosAuthenticationToken({ options, pathname });
}
