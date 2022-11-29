export const SET_SELECTED_STORE = 'SET_SELECTED_STORE';

export function setSelectedStore(props) {
  return {
    type: SET_SELECTED_STORE,
    payload: props
  };
}
