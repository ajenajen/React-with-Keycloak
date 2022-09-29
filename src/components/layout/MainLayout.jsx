import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { AuthService, useAuthentication, useAuth } from '../../services/auth';
import Loading from '../common/Loading';

import Header from './components/Header';
import NavBar from './components/NavBar';

function MainLayout({ children }) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const queryParamCode = searchParams.get('code');

  const { isAuthenticated, isLoading } = useAuth();

  useAuthentication({ pathname });

  useEffect(() => {
    if (queryParamCode !== null && queryParamCode !== '') {
      AuthService.handleAuthenticationCallback({
        code: queryParamCode,
        pathname
      });
    }
  }, [pathname, queryParamCode]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="page-wrapper">
      <Header />
      <NavBar isAuthenticated={isAuthenticated} currentPathname={pathname} />
      <main>{children}</main>
    </div>
  );
}

export default MainLayout;
