import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import Keycloak from 'keycloak-js';

import { keycloakConfig } from './configs/keycloak';
import * as authActions from '../_redux/actions/authActions';

const IdTokenKey = 'idToken';
const RefreshTokenKey = 'refreshToken';
const IamTokenKey = 'iamToken';

export const _kc = new Keycloak(keycloakConfig);

export function refreshAccessToken() {}

class Auth {
  static setIdToken(token) {
    if (token) {
      Cookies.set(IdTokenKey, token, { httpOnly: false });
    }
  }

  static setRefreshToken(token) {
    let date = new Date(Date.now());
    date.setDate(date.getDate() + 7);

    Cookies.set(RefreshTokenKey, token, {
      expires: date,
      httpOnly: false
    });
  }

  static getIdToken() {
    return Cookies.get(IdTokenKey);
  }

  static getRefreshToken() {
    return Cookies.get(RefreshTokenKey);
  }

  static getIamToken() {
    return Cookies.get(IamTokenKey);
  }

  static doLogout() {
    Cookies.remove(IdTokenKey, { path: '' });
    Cookies.remove(RefreshTokenKey, { path: '' });
    Cookies.remove(IamTokenKey, { path: '' });
    _kc.logout();
  }

  static doLogin() {
    try {
      _kc.login();
    } catch (error) {
      console.error(error);
    }
  }

  static async initKeycloak(onAuthenticatedCallback) {
    try {
      await _kc.init({ onLoad: 'check-sso' }).then(async (authenticated) => {
        if (authenticated) {
          this.setIdToken(_kc.token);
          this.setRefreshToken(_kc.refreshToken);

          setInterval(() => {
            _kc.updateToken(10).catch(() => _kc.logout());
          }, 10000);
        }
        // else {
        //   this.doLogin();
        // }
        onAuthenticatedCallback();
      });
    } catch (error) {
      console.error(error);
      // this.props.authenticationError(error);
    }
  }

  static async checkCookieAuthentication() {
    try {
      if (this.getRefreshToken === undefined) {
        this.doLogout();
      } else {
        const idToken = this.getIdToken;

        if (idToken) {
          //&& this.getIamToken
          const decoded = jwt_decode(idToken);

          if (Date.now() > decoded.exp * 1000) {
            this.doLogin();
          }

          this.props.authenticated(true);
        } else if (!idToken) {
          console.log('idToken undefined go get idToken');
          // await this.refreshAccessToken();
        }
      }
    } catch (error) {
      console.error(error);
    }
    // return async (dispatch) => {
    //   const isAuthed = this.getToken() ? true : false;
    //   // await Auth.isAuthenticatedWithCookie(cluster); check cluster and namespace
    //   if (isAuthed) {
    //     await dispatch(authenticate(true));
    //   } else {
    //     dispatch(setAuthenticated(false));
    //   }
    //   return isAuthed;
    // };
  }

  static async refreshAccessToken() {
    const token = this.getRefreshToken;
    this.setIdToken(token);
  }

  static isLoggedIn = () => !!_kc.token;

  static updateToken = (successCallback) =>
    _kc.updateToken(5).then(successCallback).catch(this.doLogin());
}

function mapStateToProps({ auth: { authenticated, sessionExpired } }) {
  return {
    authenticated,
    sessionExpired
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthenticated: (authenticated) =>
      dispatch(authActions.setAuthenticated(authenticated))
    // setSessionExpired: () => dispatch(authActions.setSessionExpired()),
    // authenticationError: () => dispatch(authActions.authenticationError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
