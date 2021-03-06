const { BOARD_LEN } = require("../common/const");

class Board {
  constructor(wordlist) {
    this.tiles = wordlist.getRandomWords(BOARD_LEN * BOARD_LEN);
  }

  getTile(r, c) {
    return this.tiles[this.coordToIndex(r, c)];
  }

  validTile(r, c) {
    return 0 <= r && r < BOARD_LEN && 0 <= c && c < BOARD_LEN;
  }

  isValid(word) {
    throw new Error("Board needs to override isValid function"); 
  }

  validWord(word) {
    const index = this.tiles.indexOf(word);
    if (index === -1) {
      return true;
    }
    return this.isValid(word);
  }

  coordToIndex(r, c) {
    return r * BOARD_LEN + c;
  }

  indexToCoord(index) {
    return [Math.floor(index / BOARD_LEN), index % BOARD_LEN];
  }

  genJson(board) {
    var result = { board : [] };
    for (var r = 0; r < BOARD_LEN; r++) {
      result.board.push([])
      for (var c = 0; c < BOARD_LEN; c++) {
        result.board[r].push({ word: this.getTile(r, c) });
      }
    }
    return result;
  }

  json() {
    return this.jsonObj;
  }
}

module.exports = Board;
