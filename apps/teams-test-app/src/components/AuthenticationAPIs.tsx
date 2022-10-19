import { app, authentication, initialize } from '@microsoft/teams-js';
import React, { ReactElement } from 'react';

import { ApiWithoutInput, ApiWithTextInput } from './utils';
import { ModuleWrapper } from './utils/ModuleWrapper';

type authAuthenticateParams = authentication.AuthenticatePopUpParameters & { mockOAuth?: boolean };

const Initialize = (): React.ReactElement =>
  ApiWithoutInput({
    name: 'initialize',
    title: 'Initialize',
    onClick: {
      withPromise: async () => {
        await app.initialize();
        return 'called';
      },
      withCallback: (setResult) => {
        const callback = (): void => {
          return;
        };
        initialize(callback);
        setResult('called');
      },
    },
  });

const GetAuthToken = (): React.ReactElement =>
  ApiWithTextInput<authentication.AuthTokenRequestParameters>({
    name: 'getAuthToken',
    title: 'Get Auth Token',
    onClick: {
      validateInput: () => {
        return; //This API can have no input
      },
      submit: {
        withPromise: async (authParams) => {
          const result = await authentication.getAuthToken(authParams);
          return JSON.stringify(result);
        },
        withCallback: (authParams, setResult) => {
          const callback = (result: string): void => {
            setResult(result);
          };
          const authRequest: authentication.AuthTokenRequest = {
            successCallback: callback,
            failureCallback: callback,
            ...authParams,
          };
          authentication.getAuthToken(authRequest);
        },
      },
    },
  });

const GetUser = (): React.ReactElement =>
  ApiWithoutInput({
    name: 'getUser',
    title: 'Get User',
    onClick: {
      withPromise: async () => {
        const user = await authentication.getUser();
        return JSON.stringify(user);
      },
      withCallback: (setResult) => {
        const successCallback = (user: authentication.UserProfile): void => {
          setResult(JSON.stringify(user));
        };
        const failureCallback = (reason: string): void => {
          setResult(reason);
        };
        const userRequest: authentication.UserRequest = {
          successCallback: successCallback,
          failureCallback: failureCallback,
        };
        authentication.getUser(userRequest);
      },
    },
  });

const NotifyFailure = (): React.ReactElement =>
  ApiWithTextInput<string>({
    name: 'authentication.notifyFailure2',
    title: 'authentication.notifyFailure',
    onClick: async (input) => {
      authentication.notifyFailure(input);
      return 'called';
    },
  });

const NotifySuccess = (): React.ReactElement =>
  ApiWithTextInput<string>({
    name: 'authentication.notifySuccess2',
    title: 'authentication.notifySuccess',
    onClick: async (input) => {
      authentication.notifySuccess(input);
      return 'called';
    },
  });

const Authenticate = (): React.ReactElement =>
  ApiWithTextInput<authAuthenticateParams>({
    name: 'authentication.authenticate2',
    title: 'authentication.authenticate',
    onClick: {
      validateInput: (input) => {
        if (!input.url) {
          throw new Error('url is required');
        }
      },
      submit: {
        withPromise: async (authParams) => {
          const token = await authentication.authenticate(getAuthParams(authParams));
          return 'Success: ' + token;
        },
        withCallback: (authParams, setResult) => {
          const successCallback = (result: string): void => {
            setResult('Success: ' + result);
          };
          const failureCallback = (result: string): void => {
            setResult('Error: Error: ' + result);
          };
          const authRequest: authentication.AuthenticateParameters = {
            successCallback: successCallback,
            failureCallback: failureCallback,
            ...authParams,
          };
          authentication.authenticate(getAuthParams(authRequest));
        },
      },
    },
  });

const AuthenticateExternal = (): React.ReactElement => {
  const [token, setToken] = React.useState<string>();
  const doOauth = async (): Promise<void> => {
    const idx = window.location.href.lastIndexOf('/');
    const authUrl = `${window.location.href.slice(
      0,
      idx,
    )}/auth_start.html?authId={authId}&oauthRedirectMethod={oauthRedirectMethod}&hostRedirectUrl={hostRedirectUrl}&hostName={hostName}`;
    const authParams = getAuthParams({ url: authUrl, isExternal: true, mockOAuth: true });
    const result = await authentication.authenticate(authParams);
    setToken(result);
  };
  return (
    <div>
      <button onClick={doOauth}>External Auth</button>
      <div>{token}</div>
    </div>
  );
};

const getAuthParams = (authParam: authAuthenticateParams): authentication.AuthenticatePopUpParameters => {
  let authUrl = authParam.url;

  // Append mockOAuth flag at the end of URL
  if (authParam.mockOAuth) {
    authUrl = authParam.url + '&mockOAuth=true';
  }

  return {
    ...authParam,
    url: authUrl,
  };
};

const AuthenticationAPIs = (): ReactElement => (
  <ModuleWrapper title="Authentication">
    <Initialize />
    <GetAuthToken />
    <GetUser />
    <NotifyFailure />
    <NotifySuccess />
    <Authenticate />
    <AuthenticateExternal />
  </ModuleWrapper>
);

export default AuthenticationAPIs;
