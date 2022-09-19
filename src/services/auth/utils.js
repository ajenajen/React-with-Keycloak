import _ from 'lodash';
import axios from 'axios';
import Cookies from 'js-cookie';
import queryString from 'query-string';
import jwt_decode from 'jwt-decode';

import {
  ID_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  IAM_TOKEN_NAME,
  authorizationUrl,
  accessTokenUrl,
  logoutUrl
} from './configs';

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

  await axios(options)
    .then(async (response) => {
      const { id_token, refresh_token } = response?.data;

      setIdToken(id_token);
      setRefreshToken(refresh_token);

      if (id_token !== undefined) {
        return await iamTokenAuthentication(id_token)
          .then((response) => {
            const { iamToken } = response;
            setIamToken(iamToken);
          })
          .then(() => {
            window.location.replace(pathname);
          })
          .catch((e) => console.error(e));
      }
    })
    .catch((e) => console.error(e));
}

export async function iamTokenAuthentication(id_token) {
  const defaultData = {
    iamToken: undefined,
    k8sToken: undefined
  };
  try {
    const project = _.get(
      JSON.parse(localStorage.getItem('selectedProject')),
      `projectCode`,
      ''
    );

    if (project) {
      const option = {
        method: 'GET',
        url: `${process.env.REACT_APP_API_IAM_PATH}/v1/iamtoken?projectCode=${project}`,
        headers: { authorization: `Bearer ${id_token}` }
      };
      await axios(option)
        .then(({ data: result }) => {
          return { ...result };
        })
        .catch((e) => {
          console.error('Iam Authentication', e);
          return defaultData;
        });
    } else {
      return defaultData;
    }
  } catch (error) {
    console.error(error);
  }
}

export function checkCookieAuthentication() {
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

      // console.log(
      //   'Date.now() > decoded.exp * 1000',
      //   Date.now() > decoded.exp * 1000
      // );
      if (Date.now() > decoded.exp * 1000) {
        updateAuthorizationToken();
      }

      isCookieAuthentication = true;
    } else if (idToken === undefined || noTokenCookies) {
      // await doLogout();
      isCookieAuthentication = false;
    }
  } catch (error) {
    console.error(error);
    isCookieAuthentication = false;
  }

  return isCookieAuthentication;
}

export async function updateAuthorizationToken() {
  console.log('updateAuthorizationToken');
  const data = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: getRefreshToken()
  };

  const options = {
    method: 'POST',
    url: accessTokenUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: queryString.stringify(data)
  };

  await axios(options)
    .then(async (response) => {
      const { id_token, refresh_token } = response?.data;

      setIdToken(id_token);
      setRefreshToken(refresh_token);

      if (id_token !== undefined) {
        return await iamTokenAuthentication(id_token)
          .then((response) => {
            const { iamToken } = response;
            setIamToken(iamToken);
          })
          .then(() => {
            // window.location.replace(`/`);
          })
          .catch((e) => console.error(e));
      }
    })
    .catch((e) => console.error(e));

  // setIdToken(token);
}
