import {
  SET_AUTHENTICATED,
  SET_AUTHENTICATING,
  SET_SESSION_EXPIRED,
  SET_IAM_TOKEN_READY,
  SET_FETCHING_FIRSTTIME
} from 'stores/actions/authActions';

const initialState = {
  authenticated: false,
  authenticating: false,
  sessionExpired: false,
  iamTokenReady: false,
  authenticationError: '',
  fetchAuthenFirstime: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, authenticated: action.payload };

    case SET_AUTHENTICATING:
      return { ...state, authenticating: action.payload };

    case SET_SESSION_EXPIRED:
      return { ...state, sessionExpired: action.payload };

    case SET_IAM_TOKEN_READY:
      return { ...state, iamTokenReady: action.payload };

    case SET_FETCHING_FIRSTTIME:
      return { ...state, fetchAuthenFirstime: action.payload };

    default:
      return state;
  }
};

export default authReducer;
