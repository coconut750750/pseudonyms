export default class Board {
  constructor() {
    this.tiles = [];
    this.colors = [];
  }

  load(tiles) {
    for (var row of tiles) {
      this.tiles.push([]);
      this.colors.push([]);

      for (var col of row) {
        var lastIndex = this.tiles.length - 1;
        this.tiles[lastIndex].push(col.word);
        this.colors[lastIndex].push('');
      }
    }

    this.width = this.tiles[0].length;
    this.height = this.tiles.length;
  }

  get(r, c) {
    return this.tiles[r][c];
  }

  getColor(r, c) {
    return this.colors[r][c];
  }
}

export function newBoard(json) {
  let b = new Board();
  b.load(json);
  return b;
}
