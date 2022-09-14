import { useEffect } from 'react';
import { AuthService } from '../../../services/auth';

function LogoutPage() {
  useEffect(() => {
    AuthService.doLogout();
  }, []);
  return;
}

export default LogoutPage;
