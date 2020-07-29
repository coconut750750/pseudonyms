export default class Board {
  constructor() {
    this.tiles = [];
    this.width = 0;
    this.height = 0;
  }

  load(tiles) {
    for (var row of tiles) {
      this.tiles.push([]);

      for (var col of row) {
        var lastIndex = this.tiles.length - 1;
        this.tiles[lastIndex].push(col.word);
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
  let b = new Board();
  b.load(json);
  return b;
}
