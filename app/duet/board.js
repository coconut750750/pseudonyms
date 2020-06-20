var _ = require('lodash');
const c = require("../common/const");
const { BOARD_LEN } = c;
const { RED, BLUE } = c.duet;

const BoardInterface = require("../common/board")

class Board extends BoardInterface {
  constructor(wordlist, notifyReveal, sendAllReveals) {
    super(wordlist);

    this.revealed = [];
    for (var i = 0; i < BOARD_LEN * BOARD_LEN; i++) { this.revealed.push(new Set()) };

    this.jsonObj = this.genJson();
    this.notifyReveal = notifyReveal;
    this.sendAllReveals = sendAllReveals;
  }

  isRevealed(r, c, team) {
    return this.revealed[this.coordToIndex(r, c)].has(team);
  }

  isValid(word) {
    const index = this.tiles.indexOf(word);
    const [r, c] = this.indexToCoord(index)
    return this.isRevealed(r, c, RED) && this.isRevealed(r, c, BLUE);
  }

  reveal(r, c, team, isGreen) {
    if (this.isRevealed(r, c, team)) {
      return;
    }
    const index = this.coordToIndex(r, c);

    if (isGreen) {
      this.revealed[index].add(RED);
      this.revealed[index].add(BLUE);
    } else {
      this.revealed[index].add(team);
    }
    this.notifyReveal(r, c, team);
  }

  sendReveals() {
    this.sendAllReveals(this.revealed);
  }
}

module.exports = Board;