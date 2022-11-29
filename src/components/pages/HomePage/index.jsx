import MainLayout from '../../layout/MainLayout';
import { useAuth } from 'modules/auth';

function HomePage() {
  const { authenticated } = useAuth();

  return <MainLayout>{authenticated && 'authenticated'}</MainLayout>;
}

export default HomePage;
