import {
  SET_CURRENT_PROJECT,
  SET_CURRENT_CLUSTER,
  SET_CURRENT_NAMESPACE
} from '../actions/storeActions';

const initialState = {
  project: '',
  cluster: '',
  namespace: ''
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_PROJECT:
      return {
        ...state,
        project: action.payload
      };

    case SET_CURRENT_CLUSTER:
      return {
        ...state,
        cluster: action.payload
      };

    case SET_CURRENT_NAMESPACE:
      return {
        ...state,
        namespace: action.payload
      };

    default:
      return state;
  }
};

export default storeReducer;
