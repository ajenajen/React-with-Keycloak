import { makeAutoObservable, observable, action } from 'mobx';
import axios from 'axios';
import queryString from 'query-string';
import { AuthService as Auth } from '../services/auth';

export interface IAuthState {
  sessionExpired: boolean;
  authenticated: boolean;
}

export class AuthStore {
  private authenticated = false;
  private sessionExpired = false;

  constructor(private readonly authService: Auth) {
    makeAutoObservable(this, {
      isAuthenticated: observable,
      isSessionExpired: observable,
      authenticate: action,
      logout: action
    });
    // this.authenticated = !!this.getAccessToken();
  }

  async authenticate(token: string) {
    try {
      // this.logout();
      console.log(token);
      const data = queryString.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        redirect_uri: process.env.REACT_APP_NEXTAUTH_URL,
        code: token
      });

      await axios({
        method: 'POST',
        url: `${Auth.tokenURI}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      }).then(async (res) => {
        console.log(res);
        // Cookies.set('idToken', res?.data?.id_token, { httpOnly: false });
        // Cookies.set('refreshToken', res?.data?.refresh_token, {
        //   expires: date,
        //   httpOnly: false
        // });
        // const iam = await getIAM(res?.data?.id_token);
        // console.log('iam : ', iam);
        // if (iam?.iam?.iamToken) {
        //   Cookies.set('iamToken', iam?.iam?.iamToken, { httpOnly: false });
        //   console.log('set IAM TOKEN 🟢');
        // }
      });

      this.setAuthenticated(true);
    } catch (err) {
      this.setAuthenticated(false);
    }
  }

  logout() {
    Auth.unsetAuthCookie();
  }

  // async checkAccessToken() {
  //   setSessionExpired(true)
  // }

  private setAuthenticated(authenticated: boolean) {
    this.authenticated = authenticated;
  }

  private setSessionExpired(sessionExpired: boolean) {
    this.sessionExpired = sessionExpired;
  }

  getAccessToken() {
    return Auth.getAccessToken();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  isSessionExpired() {
    return this.sessionExpired;
  }
}
