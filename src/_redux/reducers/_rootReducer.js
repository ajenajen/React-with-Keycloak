import { combineReducers } from 'redux';
import authReducer from './authReducer';
import storeReducer from './storeReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  store: storeReducer
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
