export default class Board {
  constructor() {
    this.tiles = [];
    this.colors = [];
    this.revealed = [];
  }

  load(tiles) {
    for (var row of tiles) {
      this.tiles.push([]);
      this.colors.push([]);
      this.revealed.push([]);

      for (var col of row) {
        var lastIndex = this.tiles.length - 1;
        this.tiles[lastIndex].push(col.word);
        this.colors[lastIndex].push('');
        this.revealed[lastIndex].push(false);
      }
    }

    this.width = this.tiles[0].length;
    this.height = this.tiles.length;
  }

  copy(board) {
    this.tiles = board.tiles;
    this.colors = board.colors;
    this.revealed = board.revealed;
    this.width = this.tiles[0].length;
    this.height = this.tiles.length;
  }

  get(r, c) {
    return this.tiles[r][c];
  }

  getColor(r, c) {
    return this.colors[r][c];
  }

  isRevealed(r, c) {
    return this.revealed[r][c];
  }

  reveal(r, c, color) {
    this.colors[r][c] = color;
    this.revealed[r][c] = true;
  }
}

export function newBoard(json) {
  let b = new Board();
  b.load(json);
  return b;
}

export function copyBoard(board) {
  let b = new Board()
  b.copy(board);
  return b;
}