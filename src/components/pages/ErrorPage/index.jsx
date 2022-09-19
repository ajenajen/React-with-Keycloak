import MainLayout from '../../layout/MainLayout';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <MainLayout>
      <div style={{ textAlign: 'center' }}>
        <h1>ErrorPage</h1>
        <br />
        <Link to="/">Back to home</Link>
      </div>
    </MainLayout>
  );
}

export default ErrorPage;
