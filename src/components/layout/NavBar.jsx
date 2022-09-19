import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../../services/auth';

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
    <>
      <nav>
        <Link style={{ margin: 10 }} to="/">
          Home
        </Link>
        <Link style={{ margin: 10 }} to="/readmd">
          Read .Md
        </Link>
        <Link style={{ margin: 10 }} to="/projects">
          Projects
        </Link>
      </nav>
      <div
        style={{
          display: 'block',
          textAlign: 'right',
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
    </>
  );
}

export default NavBar;
