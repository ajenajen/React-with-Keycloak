import { Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';

function NavBar({ isAuthenticated = false }) {
  return (
    <>
      <nav>
        <Link style={{ margin: 10 }} to="/">
          Home
        </Link>
        <Link style={{ margin: 10 }} to="/marketplace">
          Marketplace
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
          <button
            onClick={(e) => {
              e.preventDefault();
              AuthService.doLogin();
            }}
          >
            Sign in
          </button>
        ) : (
          <>
            <Link style={{ margin: 10 }} to="/profile">
              Profile
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                AuthService.doLogout();
              }}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default NavBar;
