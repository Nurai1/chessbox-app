const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the actual client code with isolated browser/hooks/API dependencies.
// These tests need neither a browser session nor additional frontend packages.
const projectRoot = path.resolve(__dirname, '../..');
const jsx = (type, props) => ({ type, props: props ?? {} });
const runtime = { jsx, jsxs: jsx, Fragment: 'Fragment' };
const AppRoute = {
  Root: '/',
  SignIn: 'signin',
  EmailConfirmation: 'email-confirmation',
};
const translation = { useOptionalTranslation: () => ({ t: (key) => key }) };

const loadClient = (file, mocks, globals = {}) => {
  const filename = path.join(projectRoot, 'client/src', file);
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ES2021,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  const exports = {};
  vm.runInNewContext(
    result.outputText,
    {
      exports,
      URLSearchParams,
      ...globals,
      require(name) {
        if (name === 'react/jsx-runtime') return runtime;
        if (Object.hasOwn(mocks, name)) return mocks[name];
        throw new Error(`Unexpected client dependency: ${name}`);
      },
    },
    { filename }
  );
  return exports;
};
const elements = (tree, type) => {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree))
    return tree.flatMap((child) => elements(child, type));
  return [
    ...(tree.type === type ? [tree] : []),
    ...elements(tree.props?.children, type),
  ];
};
const settle = () => new Promise((resolve) => setImmediate(resolve));

const confirmationPage = (
  api,
  search = '?email=athlete%40example.test&confirmationCode=1234'
) => {
  let state;
  const effects = [];
  const page = loadClient(
    'routes/ConfirmationEmailPage.tsx',
    {
      react: {
        useMemo: (factory) => factory(),
        useState: (initial) => {
          state ??= initial;
          return [
            state,
            (value) => {
              state = value;
            },
          ];
        },
        useEffect: (callback) => effects.push(callback),
      },
      'react-router-dom': { Link: 'Link' },
      'src/api/requests/signUp': { confirmEmailApi: api },
      'src/constants/appRoute': { AppRoute },
      'src/ui': { Alert: 'Alert' },
      '../hooks/useOptionalTranslation': translation,
      '../ui/LineLoader': { LineLoader: 'LineLoader' },
    },
    { window: { location: { search } } }
  );
  return { render: page.ConfirmationEmailPage, effects, state: () => state };
};

test('email link confirms successfully in a fresh browser with no session storage', async () => {
  const calls = [];
  const page = confirmationPage(async (body) => {
    calls.push(body);
    return { data: { emailConfirmed: true } };
  });
  page.render();
  page.effects.shift()();
  await settle();
  const tree = page.render();
  assert.equal(page.state().type, 'success');
  assert.equal(calls[0].email, 'athlete@example.test');
  assert.equal(calls[0].confirmationCode, '1234');
  assert.equal(elements(tree, 'Alert')[0].props.type, 'success');
  assert.equal(
    elements(tree, 'Link')[0].props.to,
    '/signin?email=athlete%40example.test'
  );
});

test('StrictMode effect replay can complete without changing authentication state', async () => {
  let requests = 0;
  const page = confirmationPage(async () => {
    requests++;
    return { data: { emailConfirmed: true } };
  });
  page.render();
  const cleanup = page.effects.shift()();
  cleanup();
  page.render();
  page.effects.shift()();
  await settle();
  assert.equal(requests, 2);
  assert.equal(page.state().type, 'success');
});

test('missing confirmation parameters do not submit a request', () => {
  const page = confirmationPage(() => {
    throw new Error('Must not request confirmation');
  }, '?email=athlete%40example.test');
  page.render();
  page.effects.shift()();
  assert.equal(page.state().type, 'failed');
  assert.equal(page.state().message, 'emailConfirmationInvalid');
});

test('email addresses containing a literal percent sign are decoded only once', async () => {
  let receivedEmail;
  const page = confirmationPage(async (body) => {
    receivedEmail = body.email;
    return { data: { emailConfirmed: true } };
  }, '?email=athlete%25training%40example.test&confirmationCode=1234');
  page.render();
  page.effects.shift()();
  await settle();
  assert.doesNotThrow(() => page.render());
  assert.equal(receivedEmail, 'athlete%training@example.test');
  assert.equal(page.state().type, 'success');
});

test('network failure is shown locally and does not trigger login or logout', async () => {
  const page = confirmationPage(async () => {
    throw new Error('Network unavailable');
  });
  page.render();
  page.effects.shift()();
  await settle();
  assert.equal(page.state().type, 'failed');
  assert.equal(page.state().message, 'emailConfirmationFailed');
});

for (const [status, expectedMessage] of [
  [400, 'emailConfirmationInvalid'],
  [500, 'emailConfirmationFailed'],
]) {
  test(`HTTP ${status} confirmation failure is reported without changing the session`, async () => {
    const page = confirmationPage(async () => ({
      error: { error: 'Request failed' },
      response: { status },
    }));
    page.render();
    page.effects.shift()();
    await settle();
    assert.equal(page.state().type, 'failed');
    assert.equal(page.state().message, expectedMessage);
  });
}

test('unmounted confirmation screen ignores late responses', async () => {
  let resolve;
  const page = confirmationPage(
    () =>
      new Promise((done) => {
        resolve = done;
      })
  );
  page.render();
  const cleanup = page.effects.shift()();
  cleanup();
  resolve({ data: { emailConfirmed: true } });
  await settle();
  assert.equal(page.state().type, 'pending');
});

test('confirmation API uses the unauthenticated transport', async () => {
  const calls = [];
  const api = loadClient('api/requests/signUp.ts', {
    'src/api/api': {
      patchRaw: async (...args) => {
        calls.push(args);
        return { data: { emailConfirmed: true } };
      },
      post: () => {
        throw new Error('Unexpected signup');
      },
    },
  });
  await api.confirmEmailApi({
    email: 'athlete@example.test',
    confirmationCode: '1234',
  });
  assert.equal(calls[0][0], '/api/user/confirmEmail');
  assert.equal(calls[0][1].headers, undefined);
});

test('existing unconfirmed session refreshes server state after confirmation on another device', () => {
  let user = { _id: 'desktop-user', emailConfirmed: false };
  let pathname = '/competitions';
  const actions = [];
  const layout = loadClient('layouts/MainLayout/MainLayout.tsx', {
    react: {},
    'react-router-dom': {
      Outlet: 'Outlet',
      useLocation: () => ({ pathname }),
      useNavigate: () => () => {},
    },
    'src/components': { Header: 'Header' },
    '../../constants/appRoute': { AppRoute },
    '../../hooks/redux': {
      useAppDispatch: () => (action) => actions.push(action),
      useAppSelector: (selector) =>
        selector({ user: { authorizedUser: user, authLoading: false } }),
    },
    '../../store/slices/userSlice': {
      checkAuth: () => ({ type: 'refresh-current-session' }),
      logout: () => ({ type: 'logout' }),
    },
    '../../hooks/useOptionalTranslation': translation,
    '../../ui': { Button: 'Button', Modal: 'Modal' },
  });
  const modal = elements(layout.MainLayout(), 'Modal')[0];
  assert.equal(modal.props.isOpen, true);
  elements(modal.props.submitButton, 'Button')[1].props.onClick();
  assert.equal(actions[0].type, 'refresh-current-session');
  user = { ...user, emailConfirmed: true };
  assert.equal(elements(layout.MainLayout(), 'Modal')[0].props.isOpen, false);
  user = { ...user, emailConfirmed: false };
  pathname = '/email-confirmation';
  assert.equal(elements(layout.MainLayout(), 'Modal')[0].props.isOpen, false);
});

const userSlice = () => {
  const executors = {};
  let config;
  let currentUserRequests = 0;
  const savedTokens = [];
  loadClient('store/slices/userSlice.ts', {
    '@reduxjs/toolkit': {
      createAsyncThunk: (type, executor) => {
        executors[type] = executor;
        const thunk = () => {};
        for (const phase of ['pending', 'fulfilled', 'rejected'])
          thunk[phase] = { type: `${type}/${phase}` };
        return thunk;
      },
      createSlice: (options) => {
        config = options;
        return { reducer: () => {}, actions: {} };
      },
    },
    'src/api/requests/signIn': {},
    'src/api/requests/signUp': {},
    'src/api/requests/users': {
      getCurrentUser: async () => {
        currentUserRequests++;
        return {};
      },
    },
    'src/constants/authorizationStatus': {
      AuthorizationStatus: {
        Auth: 'auth',
        NoAuth: 'no-auth',
        Unknown: 'unknown',
      },
    },
    'src/helpers/tokenStorage': {
      getToken: () => '',
      saveToken: (token) => savedTokens.push(token),
      dropToken: () => {},
    },
  });
  return {
    config,
    executors,
    savedTokens,
    requests: () => currentUserRequests,
  };
};

test('fresh browser startup does not send a failing session check without a token', async () => {
  const slice = userSlice();
  assert.equal(await slice.executors['user/checkAuth'](), null);
  assert.equal(slice.requests(), 0);
  assert.equal(slice.executors['user/confirmEmail'], undefined);
});

test('signup retains only the email needed for the original browser login screen', () => {
  const slice = userSlice();
  const state = {};
  slice.config.extraReducers['user/signUp/fulfilled'](state, {
    meta: { arg: { email: 'athlete@example.test', password: 'secret' } },
  });
  assert.equal(state.registrationEmail, 'athlete@example.test');
  assert.equal(state.needCheckEmail, true);
  assert.equal(state.password, undefined);
  assert.equal(slice.savedTokens.length, 0);
});

test('password login is the operation that saves the session and clears the waiting state', () => {
  const slice = userSlice();
  const state = {
    needCheckEmail: true,
    registrationEmail: 'athlete@example.test',
  };
  slice.config.extraReducers['user/signIn/fulfilled'](state, {
    payload: { data: { _id: 'athlete' }, accessToken: 'password-login-token' },
  });
  assert.equal(state.authorizationStatus, 'auth');
  assert.equal(state.needCheckEmail, false);
  assert.equal(state.registrationEmail, undefined);
  assert.equal(slice.savedTokens[0], 'password-login-token');
});
