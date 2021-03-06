class GameOptions {
  constructor(clueLimit, guessLimit, wordlist, customWords) {
    this.clueLimit = parseInt(clueLimit);
    this.guessLimit = parseInt(guessLimit);
    this.wordlist = wordlist;
    this.customWords = customWords;
  }

  json() {
    let res = { clueLimit: this.clueLimit, guessLimit: this.guessLimit };
    if (this.wordlist !== undefined) {
      res = { ...res, wordlist: this.wordlist};
    } else {
      res = { ...res, wordlist: "custom"};
    }
    return res; 
  }
}

module.exports = GameOptions;