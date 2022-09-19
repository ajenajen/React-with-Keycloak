import MainLayout from '../../layout/MainLayout';
import { useAuth } from '../../../services/auth';

function HomePage() {
  const { isAuthenticated, sessionExpired } = useAuth();

  return (
    <MainLayout>
      {`Authenticated: ${isAuthenticated}`}
      <br />
      <br />
      {`SessionExpired: ${sessionExpired}`}
    </MainLayout>
  );
}

export default HomePage;
