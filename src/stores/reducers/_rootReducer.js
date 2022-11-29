import { combineReducers } from 'redux';
import authReducer from 'stores/reducers/authReducer';

export const rootReducer = combineReducers({
  auth: authReducer
});
