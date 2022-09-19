import MainLayout from '../../layout/MainLayout';
import { useAuth } from '../../../services/auth';
import ProjectList from '../ProjectsPage/section/ProjectList';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      {/* {`Authenticated: ${isAuthenticated}`}
      <br />
      <br />
      {`SessionExpired: ${sessionExpired}`} */}
      {isAuthenticated && <ProjectList />}
    </MainLayout>
  );
}

export default HomePage;
