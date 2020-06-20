const GameOptionsInterface = require("../common/gameoptions");

class GameOptions extends GameOptionsInterface {
  constructor(options) {
    const { clueLimit, guessLimit, wordlist, customWords, timers, mistakes } = options;
    super(clueLimit, guessLimit, wordlist, customWords)
    this.timers = timers;
    this.mistakes = mistakes;
  }

  json() {
    return { ...super.json(), timers: this.timers, mistakes: this.mistakes };
  }
}

module.exports = GameOptions;