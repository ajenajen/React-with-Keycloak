import { Navigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  setTimeout(() => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  }, 500);

  return children;
}

export default ProtectedRoute;
