import { combineReducers } from 'redux';
import authReducer from './authReducer';

export const rootReducer = combineReducers({
  auth: authReducer
});

// {
//   auth: {
//     authenticated: false,
//     authToken: '',
//     authenticating: false,
//     sessionExpired: false,
//     errorMsg: '',
//     userInfo: null
//   }
// }
