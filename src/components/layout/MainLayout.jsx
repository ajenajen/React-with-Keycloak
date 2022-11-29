import { useLocation } from 'react-router-dom';
import { useAuth } from 'modules/auth';
import Loading from 'components/common/Loading';

import Header from './components/Header';
import NavBar from './components/NavBar';

function MainLayout({ children }) {
  const { pathname } = useLocation();
  const { authenticated, authenticating } = useAuth();

  if (authenticating) {
    return <Loading />;
  }

  return (
    <div className="page-wrapper">
      <Header />
      <NavBar isAuthenticated={authenticated} currentPathname={pathname} />
      <main>{children}</main>
    </div>
  );
}

export default MainLayout;
