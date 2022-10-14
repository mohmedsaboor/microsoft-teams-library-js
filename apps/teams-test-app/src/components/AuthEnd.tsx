import { app, authentication } from '@microsoft/teams-js';
import React from 'react';
import { ReactElement } from 'react';

const AuthEnd = (): ReactElement => {
  const params = new URLSearchParams(window.location.search);
  const result = params.get('code');
  const state = params.get('state');
  if (state) {
    const { authId, method } = JSON.parse(state);
    if (method === 'deeplink') {
      window.location.href = `msteams://teams.microsoft.com/l/auth-callback?authId=${authId}&result=${result}`;
    } else {
      app.initialize();
      if (result) {
        authentication.notifySuccess(result);
      }
    }
  }
  return <div />;
};

export default AuthEnd;
