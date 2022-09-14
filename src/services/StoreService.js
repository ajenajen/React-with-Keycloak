import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { rootReducer } from '../_redux/reducers/_rootReducer';
// import HttpService from "./HttpService";

const setup = () => {
  const middlewares = [thunk];

  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
};

const StoreService = {
  setup
};

export default StoreService;
