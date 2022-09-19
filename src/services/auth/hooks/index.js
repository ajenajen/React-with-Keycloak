import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuthenticated,
  setIsLoading
} from '../../../_redux/actions/authActions';
import { checkCookieAuthentication } from '../utils';

export function useAuthentication() {
  const dispatch = useDispatch();

  useEffect(() => {
    const isCookieAuthentication = checkCookieAuthentication();
    if (isCookieAuthentication) {
      dispatch(setAuthenticated(true));
    }

    return () => {
      dispatch(setIsLoading(false));
      dispatch(setAuthenticated(false));
    };
  }, []);
}

export function useAuth() {
  const { auth } = useSelector((state) => state);

  return { ...auth }; // userInfo
}
