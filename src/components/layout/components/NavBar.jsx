/** @jsxImportSource @emotion/react */
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../../../services/auth';

function NavBar({ isAuthenticated = false, currentPathname }) {
  const handleLogin = useCallback(
    async () => AuthService.doLogin({ pathname: currentPathname }),
    [currentPathname]
  );
  const handleLogout = useCallback(
    async () => AuthService.doLogout({ pathname: currentPathname }),
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
        <Link style={{ margin: 10 }} to="/readmd">
          Read .Md
        </Link>
        <Link style={{ margin: 10 }} to="/schema">
          Schema
        </Link>
        <Link style={{ margin: 10 }} to="/projects">
          Projects
        </Link>

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
            <>
              <Link style={{ margin: 10 }} to="/profile">
                Profile
              </Link>
              <button onClick={handleLogout}>Sign out</button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
