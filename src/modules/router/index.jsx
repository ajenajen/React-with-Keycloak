import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from 'components/common/ProtectedRoute';

import HomePage from 'components/pages/HomePage';
import LogoutPage from 'components/pages/Auth/LogoutPage';
import ErrorPage from 'components/pages/ErrorPage';
import PrivatePage from 'components/pages/PrivatePage';

const routes = {
  '/': <HomePage />,
  '/logout': <LogoutPage />,
  '/*': <ErrorPage />
};

//:global === [global,local]
const privateRoutes = {
  '/private': <PrivatePage />
};

export default function Router() {
  return (
    <Routes>
      {Object.entries(routes).map(([route, component]) => (
        <Route key={route} path={route} element={component} />
      ))}
      {Object.entries(privateRoutes).map(([route, component]) => (
        <Route
          key={route}
          path={route}
          element={<ProtectedRoute pathname={route} outlet={component} />}
        />
      ))}
    </Routes>
  );
}
