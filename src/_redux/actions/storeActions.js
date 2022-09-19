export const SET_CURRENT_PROJECT = 'SET_CURRENT_PROJECT';
export const SET_CURRENT_CLUSTER = 'SET_CURRENT_CLUSTER';
export const SET_CURRENT_NAMESPACE = 'SET_CURRENT_NAMESPACE';

export function setCurrentProject(project) {
  return {
    type: SET_CURRENT_PROJECT,
    payload: project
  };
}

export function setCurrentCluster(cluster) {
  return {
    type: SET_CURRENT_CLUSTER,
    payload: cluster
  };
}

export function setCurrentNamespace(namespace) {
  return {
    type: SET_CURRENT_NAMESPACE,
    payload: namespace
  };
}
