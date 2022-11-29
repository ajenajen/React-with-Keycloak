import { Navigate } from 'react-router-dom';
import { useAuth } from 'modules/auth';

function ProtectedRoute({ pathname, outlet }) {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return outlet;
}

export default ProtectedRoute;
