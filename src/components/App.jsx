import { useAuthentication } from 'modules/auth';
import Router from 'modules/router';

const App = () => {
  useAuthentication();

  return <Router />;
};

export default App;
