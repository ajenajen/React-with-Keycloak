import {
  AUTHENTICATED,
  AUTHENTICATION_ERROR,
  SET_AUTHENTICATION_SESSION_EXPIRED
} from '../actions/authActions';

const initialState = {
  authenticated: false,
  sessionExpired: false,
  errorMsg: '',
  userInfo: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        authenticated: action.payload
      };

    case AUTHENTICATION_ERROR:
      return { ...state, errorMsg: action.payload };

    case SET_AUTHENTICATION_SESSION_EXPIRED:
      return { ...state, sessionExpired: action.payload };

    default:
      return state;
  }
};

export default authReducer;
