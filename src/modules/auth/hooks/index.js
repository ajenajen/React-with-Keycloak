import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'stores/store';

import {
  fetchAuthenToken,
  checkAuthenToken,
  setIamTokenReady
} from 'stores/actions/authActions';
import * as AuthService from 'modules/auth/services';

const selectProject = {
  projectCode: 'IDC2021_trial03',
  projectName: 'IDC2021 trial03'
};

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

export function useFetchIamToken() {
  const {
    auth: { authenticated }
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const idToken = AuthService.getIdToken();
  const iamToken = AuthService.getIamToken();

  const TIME_NOW = Math.floor(new Date(Date.now()).getTime() / 1000);
  const TIME_RENEW = AuthService.TIME_RENEW;
  const { expIamToken } = AuthService.getCookieExpire();
  const isExpIamToken = TIME_NOW + TIME_RENEW >= expIamToken;
  const isIamTokenReady = !!iamToken && !isExpIamToken;

  useEffect(() => {
    if (
      authenticated &&
      !isEmpty(selectProject) &&
      idToken &&
      !isIamTokenReady
    ) {
      AuthService.getIamTokenAuthentication({
        project: selectProject
      }).then(() => dispatch(setIamTokenReady(true)));
    }
  }, [authenticated, idToken, isIamTokenReady, dispatch]);

  useEffect(() => {
    isIamTokenReady
      ? dispatch(setIamTokenReady(true))
      : dispatch(setIamTokenReady(false));
  }, [isIamTokenReady, dispatch]);
}

export function useAuthentication() {
  const {
    auth: { authenticated }
  } = useAppSelector((state) => state);
  const { pathname } = useLocation();

  console.log('useAuthentication', authenticated);

  // support redirect from keycloak
  useCallbackKeyCloak(pathname);

  useFetchIamToken();

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
