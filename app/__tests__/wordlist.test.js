const WordList = require('../wordlist');

describe('initiating a wordlist', () => {
  it('get 5 random words', () => {
    const wordlist = new WordList('test');
    console.log(wordlist.getRandomWords(5));
  });
});