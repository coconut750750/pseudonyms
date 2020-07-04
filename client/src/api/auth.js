import { callApi } from './api';

export async function login(username, password) {
  return callApi('/auth/login', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
};

export async function register(username, email, password) {
  return callApi('/auth/register', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email }),
  });
};

export async function secret() {
  return callApi('/auth/valid', {
    method: "POST",
  });
};

export async function logout() {
  return callApi('/auth/logout', {
    method: "POST",
  });
};

export async function changePassword(password) {
  return callApi('/auth/change', {
    method: "POST",
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),

  });
};
