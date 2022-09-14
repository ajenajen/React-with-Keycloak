import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { accessTokenAuthentication } from '../../../services/auth/utils';

function AuthenticationCallback() {
  const [searchParams] = useSearchParams();
  const queryLoginCode = searchParams.get('code');

  useEffect(() => {
    if (queryLoginCode !== null && queryLoginCode !== '') {
      accessTokenAuthentication(queryLoginCode);
    }
  }, [queryLoginCode]);

  return;
}

export default AuthenticationCallback;
