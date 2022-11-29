/** @jsxImportSource @emotion/react */
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as AuthService from 'modules/auth/services';

function NavBar({ isAuthenticated = false, currentPathname }) {
  const handleLogin = useCallback(
    async () => AuthService.doLogin({ currentPathname }),
    [currentPathname]
  );
  const handleLogout = useCallback(
    async () => AuthService.doLogout({ currentPathname }),
    [currentPathname]
  );

  return (
    <div css={{ padding: '5px 0', background: '#666' }}>
      <nav
        css={{
          display: 'flex',
          alignItems: 'center',
          a: { color: '#ffffff' }
        }}
      >
        <Link style={{ margin: 10 }} to="/">
          Home
        </Link>
        {isAuthenticated && (
          <>
            <Link style={{ margin: 10 }} to="/project/readme">
              Read .Md
            </Link>
            <Link style={{ margin: 10 }} to="/project/deploy">
              Deployment
            </Link>
          </>
        )}

        <div
          css={{
            display: 'block',
            textAlign: 'right',
            marginLeft: 'auto',
            paddingRight: 15,
            button: { display: 'block' }
          }}
        >
          {!isAuthenticated ? (
            <button onClick={handleLogin}>Sign in</button>
          ) : (
            <button onClick={handleLogout}>Sign out</button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
