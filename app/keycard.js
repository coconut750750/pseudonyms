const { 
  RED, 
  BLUE, 
  BOARD_LEN, 
  RED_TILE, 
  BLUE_TILE, 
  WHITE_TILE, 
  BLACK_TILE, 
  N_START_TILES,
  N_OTHER_TILES,
  N_WHITE_TILES,
  N_BLACK_TILES, } = require('./const');

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class KeyCard {
  constructor() {
    this.start = Math.floor(Math.random() * 2) === 0 ? RED : BLUE;
    this.tiles = [];
    this.generate();
  }

  generate() {
    for (var i = 0; i < N_START_TILES; i++) { this.tiles.push(this.start === RED ? RED_TILE : BLUE_TILE) };
    for (var i = 0; i < N_OTHER_TILES; i++) { this.tiles.push(this.start === RED ? BLUE_TILE : RED_TILE) };
    for (var i = 0; i < N_WHITE_TILES; i++) { this.tiles.push(this.start === RED ? WHITE_TILE : WHITE_TILE) };
    for (var i = 0; i < N_BLACK_TILES; i++) { this.tiles.push(this.start === RED ? BLACK_TILE : BLACK_TILE) };
    shuffle(this.tiles);
  }

  getTile(r, c) {
    return this.tiles[r * BOARD_LEN + c];
  }
}

module.exports = KeyCard;