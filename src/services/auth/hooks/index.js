import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthenticated } from '../../../_redux/actions/authActions';
import {
  checkCookieAuthentication,
  doLogin,
  getIdToken,
  getRefreshToken
} from '../utils';

export function useAuthentication() {
  const dispatch = useDispatch();

  const idTokenInCookie = getIdToken();
  const refreshTokenInCookie = getRefreshToken();

  const handleCheckCookies = async () => {
    await checkCookieAuthentication().then(() => {
      dispatch(setAuthenticated(true));
    });
  };

  useEffect(() => {
    const tokenInCookie =
      idTokenInCookie !== undefined && refreshTokenInCookie !== undefined;

    if (tokenInCookie) {
      handleCheckCookies();
    } else {
      doLogin();
    }
  }, []);

  return;
}

export function useAuth() {
  const { auth } = useSelector((state) => state);

  return { ...auth };
}
