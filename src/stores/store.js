import { applyMiddleware, createStore } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from 'stores/reducers/_rootReducer';

export function configureStore() {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const composedEnhancers = composeWithDevTools(middlewareEnhancer);

  const store = createStore(rootReducer, composedEnhancers);

  return store;
}

export const useAppSelector = useSelector;
export const useAppDispatch = () => useDispatch();
