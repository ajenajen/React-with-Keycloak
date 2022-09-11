import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AuthService from '../../services/AuthService';
import { setAuthenticated } from '../../_redux/actions/authActions';

import NavBar from './NavBar';

function MainLayout({ children }) {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      dispatch(setAuthenticated(true));
    }
  }, []);

  return (
    <div className="container">
      <NavBar isAuthenticated={auth.authenticated} />
      {children}
    </div>
  );
}

export default MainLayout;
