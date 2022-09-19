import {
  AUTHENTICATED,
  SET_SESSION_EXPIRED,
  AUTHENTICATION_ERROR,
  SET_IAM_TOKEN,
  SET_IS_LOADING
} from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  sessionExpired: false,
  iamToken: false,
  errorMsg: '',
  isLoading: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.payload
      };

    case SET_SESSION_EXPIRED:
      return { ...state, sessionExpired: action.payload };

    case SET_IAM_TOKEN:
      return { ...state, iamToken: action.payload };

    case AUTHENTICATION_ERROR:
      return { ...state, isAuthenticated: false, errorMsg: action.payload };

    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
};

export default authReducer;
