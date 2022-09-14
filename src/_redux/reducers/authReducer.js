import {
  AUTHENTICATED,
  SET_SESSION_EXPIRED,
  AUTHENTICATION_ERROR,
  SET_IAM_TOKEN
} from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  sessionExpired: false,
  iamToken: false,
  errorMsg: ''
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload
      };

    case SET_SESSION_EXPIRED:
      return { ...state, sessionExpired: action.payload };

    case SET_IAM_TOKEN:
      return { ...state, iamToken: action.payload };

    case AUTHENTICATION_ERROR:
      return { ...state, isAuthenticated: false, errorMsg: action.payload };

    default:
      return state;
  }
};

export default authReducer;
