import { SET_SELECTED_STORE } from '../actions/storeActions';

const initialState = {
  project: { name: '', code: '' },
  cluster: '',
  namespace: ''
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_STORE:
      return {
        project: action.payload.project || { ...state.project },
        cluster: action.payload.cluster || state.cluster,
        namespace: action.payload.namespace || state.namespace
      };

    default:
      return state;
  }
};

export default storeReducer;
