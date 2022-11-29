import { combineReducers } from 'redux';
import authReducer from 'stores/reducers/authReducer';
import storeReducer from 'stores/reducers/storeReducer';

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
