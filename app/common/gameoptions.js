const mongoose = require('mongoose');

class GameOptionsSchema extends mongoose.Schema {
  constructor() {
    super();
    mongoose.Schema.apply(this, arguments);
    this.add({
      clueLimit: Number,
      guessLimit: Number,
      wordlist: String,
      customWords: [String],
    });
  }
}

class GameOptionsClass extends mongoose.Model {
  constructor(clueLimit, guessLimit, wordlist, customWords) {
    super();
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

module.exports = {
  GameOptionsSchema,
  GameOptionsClass,
};