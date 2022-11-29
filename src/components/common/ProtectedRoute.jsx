import { useAuth } from 'modules/auth';

function ProtectedRoute({ pathname, outlet }) {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <>Error router</>;
  }

  return outlet;
}

export default ProtectedRoute;
