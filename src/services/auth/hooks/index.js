import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuthenticated,
  setIsLoading
} from '../../../_redux/actions/authActions';
import { checkCookieAuthentication, iamTokenAuthentication } from '../utils';

export function useAuthentication({ pathname }) {
  const dispatch = useDispatch();
  const { auth, store } = useSelector((state) => state);
  const isAuthenticated = auth.isAuthenticated;

  const getIamAuthentication = async () => await iamTokenAuthentication();

  useEffect(() => {
    const isCookieAuthentication = checkCookieAuthentication({ pathname });
    if (isCookieAuthentication) {
      dispatch(setAuthenticated(true));
    }

    return () => {
      dispatch(setIsLoading(false));
      dispatch(setAuthenticated(false));
    };
  }, []);

  // useEffect(() => {
  //   const currentProject = store.project;
  //   if (isAuthenticated) {
  //     getIamAuthentication(currentProject);
  //   }
  // }, [isAuthenticated, store]);
}

export function useAuth() {
  const { auth } = useSelector((state) => state);

  return { ...auth }; // userInfo
}
