import { callApi } from './api';

export async function getWordlists() {
  return callApi('/game/wordlists');
}
