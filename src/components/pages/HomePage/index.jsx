import MainLayout from '../../layout/MainLayout';
import { useAuth } from '../../../services/auth';
import ProjectList from './section/ProjectList';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return <MainLayout>{isAuthenticated && <ProjectList />}</MainLayout>;
}

export default HomePage;
