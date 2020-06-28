import { callApi } from './api';

export async function getWordlists() {
  return callApi('/game/wordlists');
}

export async function submitFeedback(text) {
  return callApi('/game/feedback', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
}