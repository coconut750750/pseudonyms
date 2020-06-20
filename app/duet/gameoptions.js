const GameOptionsInterface = require("../common/gameoptions");
const { MAX_TIMER_TOKENS } = require("../common/const").duet;

class GameOptions extends GameOptionsInterface {
  constructor(options) {
    const { clueLimit, guessLimit, wordlist, customWords, timers, mistakes } = options;
    
    if (timers > MAX_TIMER_TOKENS) {
      throw new Error(`The maximum number of timer tokens is ${MAX_TIMER_TOKENS}`);
    }
    if (mistakes > timers) {
      throw new Error(`The number of allowed mistakes can't be more than the number of timer tokens`);
    }

    super(clueLimit, guessLimit, wordlist, customWords);

    this.timers = timers;
    this.mistakes = mistakes;
  }

  json() {
    return { ...super.json(), timers: this.timers, mistakes: this.mistakes };
  }
}

module.exports = GameOptions;