const { BOARD_LEN } = require("./const");

function coordToIndex(r, c) {
  return r * BOARD_LEN + c;
}

class Board {
  constructor(wordlist, notifyReveal, sendAllReveals) {
    this.tiles = wordlist.getRandomWords(BOARD_LEN * BOARD_LEN);
    this.revealed = [];
    this.jsonObj = this.genJson();
    this.notifyReveal = notifyReveal;
    this.sendAllReveals = sendAllReveals;
  }

  getTile(r, c) {
    return this.tiles[coordToIndex(r, c)];
  }

  reveal(r, c) {
    this.revealed.push([r, c]);
    this.notifyReveal(r, c);
  }

  sendReveals() {
    this.sendAllReveals([r, c]);
  }

  genJson() {
    var result = { board : [] };
    for (var r = 0; r < BOARD_LEN; r++) {
      result.board.push([])
      for (var c = 0; c < BOARD_LEN; c++) {
        result.board[r].push[{ word: this.getTile(r, c) }];
      }
    }
    return result;
  }

  json() {
    return this.jsonObj;
  }
}

module.exports = Board;