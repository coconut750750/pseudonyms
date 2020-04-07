const WordList = require('../wordlist');
const { BOARD_LEN } = require('../const');

describe('initiating a wordlist', () => {
  it('get 25 random words', () => {
    const wordlist = new WordList('classic');
    expect(wordlist.getRandomWords(BOARD_LEN * BOARD_LEN).length).toBe(BOARD_LEN * BOARD_LEN);
  });
});