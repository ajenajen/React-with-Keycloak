export const AUTHENTICATED = 'AUTHENTICATED';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const SET_SESSION_EXPIRED = 'SET_SESSION_EXPIRED';
export const SET_IAM_TOKEN = 'SET_IAM_TOKEN';
export const SET_IS_LOADING = 'SET_IS_LOADING';

export function setAuthenticated(authenticated) {
  return {
    type: AUTHENTICATED,
    payload: authenticated
  };
}

export function setSessionExpired(sessionExpired) {
  return {
    type: SET_SESSION_EXPIRED,
    payload: sessionExpired
  };
}

export function setIsLoading(loading) {
  return {
    type: SET_IS_LOADING,
    payload: loading
  };
}

export function setIamToken(iamToken) {
  return {
    type: SET_IAM_TOKEN,
    payload: iamToken
  };
}

export function authenticationError(errorMsg) {
  return {
    type: AUTHENTICATION_ERROR,
    payload: errorMsg
  };
}
