import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AuthPage from '../auth';

const RoutesContainer: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<AuthPage />}></Route>
    </Routes>
  );
};

export default RoutesContainer;
