import { SET_SELECTED_PACKAGE } from '../actions/packageActions';

const initialState = {
  isFetching: false,
  categories: [],
  selected: {
    availablePackageDetail: {},
    pkgVersion: '',
    appVersion: '',
    versions: [],
    readme: '',
    schema: {},
    values: '',
    error: {}
  }
};

const packageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_PACKAGE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default packageReducer;
