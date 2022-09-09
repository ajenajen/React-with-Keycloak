import React, { useContext, useState, useEffect } from 'react';
import * as ReactRouter from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { AuthService as Auth } from '../../services/auth';
import { StoreContext } from '../../store.context';
import { Dialog } from '@mui/material';

const AuthPage: React.FC = () => {
  const { authStore } = useContext(StoreContext);
  const authenticated = authStore.isAuthenticated();

  const [queryParamTokenAttempted, setQueryParamTokenAttempted] =
    useState(false);

  const [searchParams] = ReactRouter.useSearchParams();
  const queryParamToken = searchParams.get('code') || '';

  useEffect(() => {
    const getAuthenticated = async () => {
      await authStore.authenticate(queryParamToken);
    };

    if (!authenticated && queryParamToken !== '') {
      getAuthenticated().catch(console.error);
      setQueryParamTokenAttempted(true);
    }
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated && !queryParamTokenAttempted && queryParamToken === '') {
      console.log('in getLoginRedirect');
      Auth.getLoginRedirect();
    }
  }, [authenticated, queryParamToken, queryParamTokenAttempted]);

  return <Dialog open={!authenticated}>Loading to login...</Dialog>;
};

export default observer(AuthPage);
