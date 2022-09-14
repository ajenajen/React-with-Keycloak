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
  let date = new Date(Date.now());
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

export function doLogin() {
  const queryParam = queryString.stringify({
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_CALLBACK_URL,
    scope: 'openid'
  });

  window.location.href = `${authorizationUrl}${queryParam}`;
}

export async function doLogout() {
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

      window.location.replace('/');
    })
    .catch((e) => console.error(e));
}

export async function accessTokenAuthentication(code = '') {
  const data = {
    grant_type: 'authorization_code',
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    redirect_uri: process.env.REACT_APP_CALLBACK_URL,
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
            window.location.replace(`/`);
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

export async function checkCookieAuthentication() {
  const idToken = getIdToken();
  const refreshToken = getRefreshToken();
  const iamToken = getIamToken();

  try {
    if (refreshToken === undefined) {
      doLogout();
    } else if (idToken === undefined) {
      console.log('idToken undefined go get idToken');

      doLogin();
    } else {
      if (idToken && iamToken) {
        const decoded = jwt_decode(idToken);

        if (Date.now() > decoded.exp * 1000) {
          updateAuthorizationToken();
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateAuthorizationToken() {
  const token = this.getRefreshToken;
  this.setIdToken(token);
}
