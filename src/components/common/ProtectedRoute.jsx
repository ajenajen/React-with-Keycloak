import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const { auth } = useSelector((state) => state);

  if (!auth.authenticated) {
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectedRoute;
