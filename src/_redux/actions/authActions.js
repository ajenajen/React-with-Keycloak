export const AUTHENTICATED = 'AUTHENTICATED';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const SET_AUTHENTICATION_SESSION_EXPIRED =
  'SET_AUTHENTICATION_SESSION_EXPIRED';

export function setAuthenticated(authenticated) {
  return {
    type: AUTHENTICATED,
    payload: authenticated
  };
}

export function authenticationError(errorMsg) {
  return {
    type: AUTHENTICATION_ERROR,
    payload: errorMsg
  };
}

export function setSessionExpired(sessionExpired) {
  return {
    type: SET_AUTHENTICATION_SESSION_EXPIRED,
    payload: { sessionExpired }
  };
}
