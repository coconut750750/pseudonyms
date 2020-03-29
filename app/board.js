const { BOARD_LEN } = require("./const");

class Board {
  constructor(wordlist) {
    this.tiles = wordlist.getRandomWords(BOARD_LEN * BOARD_LEN);
  }

  getTile(r, c) {
    return this.tiles[r * BOARD_LEN + c];
  }
}

module.exports = Board;