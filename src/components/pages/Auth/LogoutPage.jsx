import { useEffect } from 'react';
import { AuthService } from 'modules/auth';

function LogoutPage() {
  useEffect(() => {
    AuthService.doLogout();
  }, []);
  return;
}

export default LogoutPage;
