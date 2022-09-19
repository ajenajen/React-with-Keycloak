import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuthenticated,
  setIsLoading
} from '../../../_redux/actions/authActions';
import {
  checkCookieAuthentication,
  iamTokenAuthentication,
  getRefreshToken
} from '../utils';

export function useAuthentication({ pathname }) {
  const dispatch = useDispatch();
  const { auth, store } = useSelector((state) => state);
  const isAuthenticated = auth.isAuthenticated;
  const currentProject = store.project;
  const refreshToken = getRefreshToken();

  useEffect(() => {
    const isCookieAuthentication = checkCookieAuthentication({ pathname });
    if (isCookieAuthentication) {
      dispatch(setAuthenticated(true));
    }

    return () => {
      dispatch(setIsLoading(false));
      dispatch(setAuthenticated(false));
    };
  }, [dispatch, pathname]);

  useEffect(() => {
    if (isAuthenticated && currentProject && refreshToken) {
      iamTokenAuthentication(currentProject);
    }
  }, [isAuthenticated, currentProject, refreshToken]);
}

export function useAuth() {
  const { auth } = useSelector((state) => state);

  return { ...auth }; // userInfo
}
