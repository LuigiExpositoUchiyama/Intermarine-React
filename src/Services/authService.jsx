const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const MOCK_USER = {
  username: 'admin',
  password: '123456',
};

function createFakeToken(username) {
  const header = btoa(
    JSON.stringify({
      alg: 'HS256',
      typ: 'JWT',
    }),
  );

  const payload = btoa(
    JSON.stringify({
      sub: username,
      exp: Math.floor(Date.now() / 1000) + 86400,
    }),
  );

  return `${header}.${payload}.fake-signature`;
}

function login({ username, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const normalizedUsername = username.trim();

      if (
        normalizedUsername === MOCK_USER.username &&
        password === MOCK_USER.password
      ) {
        const token = createFakeToken(normalizedUsername);

        localStorage.setItem(TOKEN_KEY, token);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify({
            username: normalizedUsername,
          }),
        );

        resolve(token);

        return;
      }

      reject({
        error: {
          message: 'Usuário ou senha inválidos',
        },
      });
    }, 500);
  });
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

function getUsername() {
  return getUser()?.username ?? '';
}

function isTokenExpired() {
  const token = getToken();

  if (!token) {
    return true;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (!payload.exp) {
      return true;
    }

    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

function isLoggedIn() {
  return Boolean(getToken()) && !isTokenExpired();
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

const authService = {
  login,
  getToken,
  getUser,
  getUsername,
  isLoggedIn,
  isTokenExpired,
  logout,
};

export default authService;
