import Keycloak from 'keycloak-js';
import { keycloakConfig } from './configs/keycloak';

const _kc = new Keycloak(keycloakConfig);

const initKeycloak = (onAuthenticatedCallback) => {
  _kc
    .init({
      // onLoad: 'login-required',
      onLoad: 'check-sso',
      // silentCheckSsoRedirectUri:
      //   window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256'
    })
    .then((authenticated) => {
      if (authenticated) {
        onAuthenticatedCallback();
      }
      console.log('user is not authenticated..!');
      // doLogin();
    })
    .catch(console.error);
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole
};

export default UserService;
