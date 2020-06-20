const GameOptionsInterface = require("../common/gameoptions");

class GameOptions extends GameOptionsInterface{
  constructor(options) {
    const { clueLimit, guessLimit, wordlist, customWords } = options;
    super(clueLimit, guessLimit, wordlist, customWords)
  }
}

module.exports = GameOptions;