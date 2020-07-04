export async function callApi(path, data) {
  const response = await fetch(path, data);
  if (response.status !== 200) {
    throw Error();
  }

  const body = await response.json();
  return body;
};
