import React from 'react';
import { IAuthState } from '../../../stores/auth';

const HomePage: React.FC<IAuthState> = ({ authenticated, sessionExpired }) => {
  return (
    <div>
      Authenticated: {authenticated ? 'Yes' : 'Not yet!'}
      <br />
      sessionExpired: {sessionExpired ? 'Yes' : 'Not yet!'}
    </div>
  );
};

export default HomePage;
