var _ = require('lodash');

export default class Board {
  constructor(tiles) {
    this.tiles = [];
    for (var row of tiles) {
      this.tiles.push([])
      for (var col of row) {
        this.tiles[this.tiles.length - 1].push(col.word);
      }
    }
    this.width = this.tiles[0].length;
    this.height = this.tiles.length;
  }

  get(r, c) {
    return this.tiles[r][c];
  }
}

export function newBoard(json) {
  console.log(json);
  return new Board(json);
}