export const ID_TOKEN_NAME = 'idToken';
export const REFRESH_TOKEN_NAME = 'refreshToken';
export const ACCESS_TOKEN_NAME = 'accessToken';
export const AUTH_TOKEN_MAX_AGE = 60 * 60 * 3; // 3 hour

export const authorizationUrl = `${process.env.REACT_APP_KEYCLOAK_URL}/auth/realms/${process.env.REACT_APP_KEYCLOAK_REALMS}/protocol/openid-connect/auth?response_type=code&`;
export const accessTokenUrl = `${process.env.REACT_APP_KEYCLOAK_URL}/auth/realms/${process.env.REACT_APP_KEYCLOAK_REALMS}/protocol/openid-connect/token`;
export const logoutUrl = `${process.env.REACT_APP_KEYCLOAK_URL}/auth/realms/${process.env.REACT_APP_KEYCLOAK_REALMS}/protocol/openid-connect/logout`;
