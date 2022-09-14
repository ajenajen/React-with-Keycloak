import { useAuthentication, useAuth } from '../../services/auth';

import NavBar from './NavBar';

function MainLayout({ children }) {
  const { isAuthenticated } = useAuth();

  useAuthentication();

  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} />
      {children}
    </div>
  );
}

export default MainLayout;
