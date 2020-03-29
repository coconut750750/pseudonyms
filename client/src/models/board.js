export default class Board {
  constructor() {
    this.tiles = [];
    this.colors = []
  }

  load(tiles) {
    for (var row of tiles) {
      this.tiles.push([]);
      this.colors.push([]);

      for (var col of row) {
        var lastIndex = this.tiles.length - 1;
        this.tiles[lastIndex].push(col.word);
        this.colors[lastIndex].push(undefined);
      }
    }

    this.width = this.tiles[0].length;
    this.height = this.tiles.length;
  }

  copy(board) {
    this.tiles = board.tiles;
    this.colors = board.colors;
    this.width = this.tiles[0].length;
    this.height = this.tiles.length;
  }

  get(r, c) {
    return this.tiles[r][c];
  }

  getColor(r, c) {
    return this.colors[r][c];
  }

  reveal(r, c, color) {
    console.log(r, c);
    console.log(this.colors);
    this.colors[r][c] = color;
    console.log(this.colors);
  }
}

export function newBoard(json) {
  let b = new Board();
  b.load(json);
  return b;
}

export function copyBoard(board) {
  console.log(board);
  let b = new Board()
  b.copy(board);
  return b;
}