const GameOptionsInterface = require("../common/gameoptions");
const { MAX_TIMER_TOKENS } = require("../common/const").duet;
const { GameError } = require("../common/gameerror");

class GameOptions extends GameOptionsInterface {
  constructor(options) {
    const { clueLimit, guessLimit, wordlist, customWords, timers, mistakes } = options;
    
    if (timers === undefined || mistakes === undefined) {
      throw new GameError("Missing turn limit and/or mistake limit from game options");
    }    

    if (timers > MAX_TIMER_TOKENS) {
      throw new GameError(`The maximum turn limit is ${MAX_TIMER_TOKENS}`);
    }

    if (mistakes > timers) {
      throw new GameError(`The number of allowed mistakes can't be more than the turn limit`);
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