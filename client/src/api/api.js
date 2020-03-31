async function callApi(path, data) {
  const response = await fetch(path, data);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

export async function createGame(options) {
  return callApi('/create', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
}

export async function checkCode(gameCode) {
  return callApi(`/checkcode?gameCode=${gameCode}`);
}

export async function checkName(name, gameCode) {
  if (gameCode !== undefined) {
    return callApi(`/checkname?gameCode=${gameCode}&name=${name}`);
  } else {
    return callApi(`/checkname?name=${name}`);
  }
}

export async function getWordlists() {
  return callApi('/wordlists');
}