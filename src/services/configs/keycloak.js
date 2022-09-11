export const keycloakConfig = {
  url: `${process.env.REACT_APP_KEYCLOAK_URL}/auth`,
  realm: process.env.REACT_APP_REALMS,
  clientId: process.env.REACT_APP_CLIENT_ID
};
