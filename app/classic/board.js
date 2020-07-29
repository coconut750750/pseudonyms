var _ = require('lodash');
const { BOARD_LEN } = require("../common/const");
const BoardInterface = require("../common/board")

class Board extends BoardInterface {
  constructor(wordlist, notifyReveal, sendAllReveals) {
    super(wordlist);
    this.revealed = [];
    this.revealedInts = [];

    this.jsonObj = this.genJson();
    this.notifyReveal = notifyReveal;
    this.sendAllReveals = sendAllReveals;
  }

  isRevealed(r, c) {
    return this.revealedInts.includes(this.coordToIndex(r, c));
  }

  isValid(word) {
    const index = this.tiles.indexOf(word);
    return this.revealedInts.includes(index);
  }

  reveal(r, c) {
    if (this.isRevealed(r, c)) {
      return;
    }
    this.revealed.push([r, c]);
    this.revealedInts.push(this.coordToIndex(r, c));
    this.notifyReveal(r, c);
  }

  sendReveals() {
    this.sendAllReveals(this.revealed);
  }
}

module.exports = Board;