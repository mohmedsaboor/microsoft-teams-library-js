import React from 'react';
import { ReactElement } from 'react';

const StartAuth = (): ReactElement => {
  const params = new URLSearchParams(window.location.search);
  const mockOAuth = params.get('mockOAuth');
  const authId = params.get('authId');
  const method = params.get('oauthRedirectMethod');
  const hostRedirectUrl = params.get('hostRedirectUrl');
  const state = `{"authId":"${authId}","method":"${method}","hostRedirectUrl":"${hostRedirectUrl}"}`;

  const getRedirectUri = (): string => {
    const idx = window.location.href.lastIndexOf('/');
    return `${window.location.href.slice(0, idx)}/auth_end`;
  };

  const redirect = (): void => {
    if (mockOAuth !== 'false') {
      window.location.href = `auth_end?state=${state}&code=1234`;
    } else {
      const queryObj = {
        state,
        client_id: '1073583513214-oplf5k63msf7at9rcj68vbrh265803vo.apps.googleusercontent.com',
        response_type: 'code',
        access_type: 'offline',
        scope: 'email%20profile',
      };
      const query = Object.entries(queryObj)
        .map(([k, v]) => `&${k}=${v}`)
        .join('');

      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${getRedirectUri()}${query}`;
    }
  };

  return (
    <div>
      <div>{window.location.href}</div>
      <button onClick={() => redirect()}>Continue</button>
    </div>
  );
};

export default StartAuth;
