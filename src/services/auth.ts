import axios from 'axios';
import Cookies from 'js-cookie';
import queryString from 'query-string';
import { AuthTokenKey, RefreshTokenKey, IdTokenKey } from './utils/auth.config';

export class AuthService {
  public static apiURI = `${process.env.REACT_APP_KEYCLOAK_URL}/auth/realms/${process.env.REACT_APP_REALMS}/protocol/openid-connect`;
  public static tokenURI = `${this.apiURI}/token`;
  public static logoutURI = `${this.apiURI}/logout?redirect_uri=${process.env.REACT_APP_APP_URL}`;

  public static loginConfig = {
    method: 'post',
    url: `${this.apiURI}/auth`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      responseType: 'blob'
    }
  };

  public static getAuthToken() {
    return localStorage.getItem(AuthTokenKey);
  }

  public static setAuthToken(authToken: boolean) {
    localStorage.setItem(AuthTokenKey, authToken.toString());
  }

  public static unsetAuthToken() {
    localStorage.removeItem(AuthTokenKey);
  }

  public static getAccessToken() {
    return Cookies.get(RefreshTokenKey);
  }

  public static setAccessToken(token?: string | undefined) {
    if (token) {
      Cookies.set(RefreshTokenKey, token, {
        // expires: date,
        httpOnly: false
      });
    }
  }

  public static unsetAuthCookie() {
    Cookies.remove(RefreshTokenKey);
    window.location.href = this.logoutURI;
  }

  // public static async validateToken(token: string) {
  //   try {
  //     await this.resourcesClient(token).CheckNamespaceExists({
  //       context: { cluster, namespace: 'default' }
  //     });
  //   } catch (e: any) {
  //     if (e.code === grpc.Code.Unauthenticated) {
  //       throw new Error('invalid token');
  //     }

  //     if (e.code !== grpc.Code.PermissionDenied) {
  //       if (e.code === grpc.Code.NotFound) {
  //         throw new Error('not found');
  //       }
  //       if (e.code === grpc.Code.Internal) {
  //         throw new Error('internal error');
  //       }
  //       throw new Error(`${e.code}: ${e.message}`);
  //     }
  //   }
  // }

  public static getLoginRedirect() {
    const data = queryString.stringify({
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: `${process.env.REACT_APP_REDIRECT_LOGIN_URL}`,
      scope: 'openid',
      response_type: 'code'
    });

    const authorizationURI = `${this.apiURI}/auth?${data}`;
    window.location.href = authorizationURI;
  }

  public static async refreshAccessToken() {
    const data = {
      client_id: process.env.REACT_APP_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: Cookies.get(RefreshTokenKey)
    };

    await axios({ ...this.loginConfig, data }).then(async (res) => {
      console.log(res);
      Cookies.set(IdTokenKey, res?.data?.id_token, { httpOnly: false });
      Cookies.set(RefreshTokenKey, res?.data?.refresh_token, {
        // expires: date,
        httpOnly: false
      });
    });
    console.log('set token success', Cookies.get(RefreshTokenKey));
    // const parsedResponse = await response.json();

    // if (!response.ok) {
    //   throw new Error(parsedResponse);
    // }

    return;
  }

  async handleErrorToken() {}
}
