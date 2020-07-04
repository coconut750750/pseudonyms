import sha256 from 'js-sha256';
import { callApi } from './api';

export async function getUser() {
  return callApi('/auth/user', {
    method: "POST",
  });
};

export async function login(username, password) {
  return callApi('/auth/login', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password: sha256(password) }),
  });
};

export async function register(username, email, password) {
  return callApi('/auth/register', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password: sha256(password), email }),
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
    body: JSON.stringify({ password: sha256(password) }),
  });
};

export async function forgotPassword(email) {
  return callApi('/auth/forgot', {
    method: "POST",
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
};

export async function forgotReturn(resetToken, password) {
  return callApi('/auth/forgot_return', {
    method: "POST",
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resetToken, password: sha256(password) }),
  });
}