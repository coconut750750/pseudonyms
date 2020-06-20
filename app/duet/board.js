var _ = require('lodash');
const c = require("../common/const");
const { BOARD_LEN } = c;
const { RED, BLUE, MAX_TIMER_TOKENS } = c.duet;

const BoardInterface = require("../common/board")

class Board extends BoardInterface {
  constructor(wordlist, timers, mistakes, notifyReveal, sendAllReveals) {
    this.tiles = wordlist.getRandomWords(BOARD_LEN * BOARD_LEN);
    if (timers > MAX_TIMER_TOKENS) {
      throw new Error(`The maximum number of timer tokens is ${MAX_TIMER_TOKENS}`);
    }
    if (mistakes > timers) {
      throw new Error(`The number of allowed mistakes can't be more than the number of timer tokens`);
    }
    this.timerLeft = timers;
    this.mistakesLeft = mistakes;

    this.revealed = {
      [RED]: [],
      [BLUE]: [],
    };

    this.jsonObj = this.genJson();
    this.notifyReveal = notifyReveal;
    this.sendAllReveals = sendAllReveals;
  }

  isRevealed(r, c, team) {
    return this.revealed[team].map( ([i, j]) => this.coordToIndex(i, j) ).includes(this.coordToIndex(r, c));
  }

  isValid(word) {
    const index = this.tiles.indexOf(word);
    const [r, c] = this.indexToCoord(index)
    return this.isRevealed(r, c, RED) && this.isRevealed(r, c, BLUE);
  }

  reveal(r, c, team) {
    if (this.isRevealed(r, c, team)) {
      return;
    }
    this.revealed[team].push([r, c]);
    this.notifyReveal(r, c, team);
  }

  sendReveals() {
    this.sendAllReveals(this.revealed);
  }

  json() {
    return this.jsonObj;
  }
}

module.exports = Board;