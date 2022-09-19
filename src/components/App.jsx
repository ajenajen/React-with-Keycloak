import { useRoutes } from 'react-router-dom';

import ProtectedRoute from './common/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import ClustersPage from './pages/ClustersPage';
import ReadMdPage from './pages/ReadMdPage';
import LogoutPage from './pages/Auth/LogoutPage';
import ErrorPage from './pages/ErrorPage';

const App = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/logout',
      element: <LogoutPage />
    },
    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      )
    },
    {
      path: '/projects',
      element: (
        <ProtectedRoute>
          <ProjectsPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/cluster',
      element: (
        <ProtectedRoute>
          <ClustersPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/readmd',
      element: <ReadMdPage />
    },
    {
      path: '*',
      element: <ErrorPage />
    }
  ]);

  return routes;
};

export default App;
