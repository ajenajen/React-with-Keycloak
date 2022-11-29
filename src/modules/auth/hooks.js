import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'stores/store';

import { fetchAuthenToken, checkAuthenToken } from 'stores/actions/authActions';
import * as AuthService from 'modules/auth/services';

export function useCallbackKeyCloak(pathname) {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const isTokenLogin = AuthService.getTokenLogin();

  const isRedirectFromKeyCloak =
    code !== null && !isEmpty(code) && !isTokenLogin;

  useEffect(() => {
    if (isRedirectFromKeyCloak) {
      localStorage.setItem('doingLogin', 'true');
      dispatch(fetchAuthenToken({ code, pathname }));
    }
  }, [code, dispatch, isRedirectFromKeyCloak, pathname]);
}

export function useAuthentication() {
  const {
    auth: { authenticated }
  } = useAppSelector((state) => state);
  const { pathname } = useLocation();

  console.log('useAuthentication', authenticated);

  // support redirect from keycloak
  useCallbackKeyCloak(pathname);

  useCheckAuthentication();
}

export function useCheckAuthentication() {
  const [windowOnFocus, setWindowOnFocus] = useState(true);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener(
      'focus',
      () => !windowOnFocus && setWindowOnFocus(true)
    );
    window.addEventListener('blur', () => setWindowOnFocus(false));
    return () => {
      window.removeEventListener('focus', () => setWindowOnFocus(true));
      window.removeEventListener('blur', () => setWindowOnFocus(false));
    };
  }, [windowOnFocus]);

  useEffect(() => {
    windowOnFocus && dispatch(checkAuthenToken({ pathname }));
  }, [windowOnFocus, pathname, dispatch]);
}

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);

  return auth;
}
