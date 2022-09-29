export const SET_SELECTED_PACKAGE = 'SET_SELECTED_PACKAGE';

export function setSelectedPackage(props) {
  return {
    type: SET_SELECTED_PACKAGE,
    payload: props
  };
}
