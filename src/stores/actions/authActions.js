import {
  accessTokenAuthentication,
  checkCookieAuthentication
} from 'modules/auth/services';

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const SET_AUTHENTICATING = 'SET_AUTHENTICATING';
export const SET_AUTHENTICATION_ERROR = 'SET_AUTHENTICATION_ERROR';
export const SET_SESSION_EXPIRED = 'SET_SESSION_EXPIRED';
export const SET_IAM_TOKEN_READY = 'SET_IAM_TOKEN_READY';
export const SET_FETCHING_FIRSTTIME = 'SET_FETCHING_FIRSTTIME';

export const fetchAuthenToken =
  ({ code, pathname }) =>
  async (dispatch, getState) => {
    accessTokenAuthentication({
      code,
      pathname
    })
      .then((response) => {
        dispatch(setAuthenticated(true));
        dispatch(setAuthenticating(false));

        response && window.history.replaceState({}, 'session_state', pathname);
      })
      .catch((error) => {
        throw error;
      });
  };

export const checkAuthenToken =
  ({ pathname }) =>
  async (dispatch, getState) => {
    checkCookieAuthentication({ pathname })
      .then((response) => {
        if (getState.fetchAuthenFirstime) {
          dispatch(setFetchingFirsttime(false));
        } else {
          dispatch(setAuthenticated(response));
          dispatch(setFetchingFirsttime(false));
        }
      })
      .catch((error) => {
        console.log('checkAuthenToken error', error);
        dispatch(setAuthenticated(false));
      });
  };

export function setAuthenticated(value) {
  return {
    type: SET_AUTHENTICATED,
    payload: value
  };
}
export function setAuthenticating(value) {
  return {
    type: SET_AUTHENTICATING,
    payload: value
  };
}
export function setSessionExpired(value) {
  return {
    type: SET_SESSION_EXPIRED,
    payload: value
  };
}
export function setIamTokenReady(value) {
  return {
    type: SET_IAM_TOKEN_READY,
    payload: value
  };
}
export function setFetchingFirsttime(value) {
  return {
    type: SET_FETCHING_FIRSTTIME,
    payload: value
  };
}
