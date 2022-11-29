import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from 'components/common/ProtectedRoute';

import HomePage from 'components/pages/HomePage';
import ReadMdPage from 'components/pages/ReadMdPage';
import DeploymentPage from 'components/pages/DeploymentPage';
import LogoutPage from 'components/pages/Auth/LogoutPage';
import ErrorPage from 'components/pages/ErrorPage';

const routes = {
  '/': <HomePage />,
  '/logout': <LogoutPage />,
  '/*': <ErrorPage />
};

//:global === [global,local]
const privateRoutes = {
  '/project/deploy': <DeploymentPage />,
  '/project/readme': <ReadMdPage />
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
