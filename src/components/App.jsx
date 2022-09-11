import { useRoutes } from 'react-router-dom';

import ProtectedRoute from './common/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketplacePage from './pages/MarketplacePage';

const App = () => {
  const routes = useRoutes([
    {
      path: '/*',
      element: <HomePage />
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
      path: '/marketplace',
      element: <MarketplacePage />
    }
  ]);
  return routes;
};

export default App;
