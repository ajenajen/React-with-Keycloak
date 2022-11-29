import MainLayout from '../../layout/MainLayout';
import { useAuth } from 'modules/auth';
import ProjectList from '../ProjectsPage/section/ProjectList';

function HomePage() {
  const { authenticated } = useAuth();

  return <MainLayout>{authenticated && <ProjectList />}</MainLayout>;
}

export default HomePage;
