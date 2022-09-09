import React, { Fragment, useContext, useEffect } from 'react';

import { StoreContext } from '../../store.context';
import RoutesContainer from './routes';
import HomePage from '../pages/HomePage';

const App: React.FC = () => {
  const { authStore } = useContext(StoreContext);
  const authenticated = authStore.isAuthenticated();
  const sessionExpired = authStore.isSessionExpired();

  useEffect(() => {
    if (!authenticated) {
      // window.location.replace('/auth/login');
    }
  }, []);

  return (
    <Fragment>
      <RoutesContainer />
      <HomePage sessionExpired={sessionExpired} authenticated={authenticated} />
    </Fragment>
  );
};

export default App;
