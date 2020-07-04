import { callApi } from './api';

export async function createClassicGame(options) {
  return callApi('/register/classic/create', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
}

export async function createDuetGame(options) {
  return callApi('/register/duet/create', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
}

export async function createRankedGame(options) {
  return callApi('/register/ranked/create', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
}

export async function checkCode(gameCode) {
  return callApi(`/register/checkcode?gameCode=${gameCode}`);
}

export async function checkName(name, gameCode) {
  if (gameCode !== undefined) {
    return callApi(`/register/checkname?gameCode=${gameCode}&name=${name}`);
  } else {
    return callApi(`/register/checkname?name=${name}`);
  }
}
