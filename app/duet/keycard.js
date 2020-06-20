const c = require('../common/const');

const { BOARD_LEN } = c;
const { 
  RED,
  BLUE,
  GREEN_TILE, 
  WHITE_TILE, 
  BLACK_TILE, 
  N_GREEN_GREEN_TILES,
  N_WHITE_WHITE_TILES,
  N_BLACK_BLACK_TILES,
  N_GREEN_WHITE_TILES,
  N_WHITE_GREEN_TILES,
  N_GREEN_BLACK_TILES,
  N_BLACK_GREEN_TILES,
  N_WHITE_BLACK_TILES,
  N_BLACK_WHITE_TILES, } = c.duet;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class KeyCard {
  constructor(timers, mistakes) {
    this.tiles = [];
    this.leftover = 15;

    this.generate();
    this.jsonObj = this.genJson();
  }

  generate() {
    for (var i = 0; i < N_GREEN_GREEN_TILES; i++) { this.tiles.push({[RED]: GREEN_TILE, [BLUE]: GREEN_TILE}) };
    for (var i = 0; i < N_WHITE_WHITE_TILES; i++) { this.tiles.push({[RED]: WHITE_TILE, [BLUE]: WHITE_TILE}) };
    for (var i = 0; i < N_BLACK_BLACK_TILES; i++) { this.tiles.push({[RED]: BLACK_TILE, [BLUE]: BLACK_TILE}) };
    for (var i = 0; i < N_GREEN_WHITE_TILES; i++) { this.tiles.push({[RED]: GREEN_TILE, [BLUE]: WHITE_TILE}) };
    for (var i = 0; i < N_WHITE_GREEN_TILES; i++) { this.tiles.push({[RED]: WHITE_TILE, [BLUE]: GREEN_TILE}) };
    for (var i = 0; i < N_GREEN_BLACK_TILES; i++) { this.tiles.push({[RED]: GREEN_TILE, [BLUE]: BLACK_TILE}) };
    for (var i = 0; i < N_BLACK_GREEN_TILES; i++) { this.tiles.push({[RED]: BLACK_TILE, [BLUE]: GREEN_TILE}) };
    for (var i = 0; i < N_WHITE_BLACK_TILES; i++) { this.tiles.push({[RED]: WHITE_TILE, [BLUE]: BLACK_TILE}) };
    for (var i = 0; i < N_BLACK_WHITE_TILES; i++) { this.tiles.push({[RED]: BLACK_TILE, [BLUE]: WHITE_TILE}) };
    shuffle(this.tiles);
  }

  getTile(r, c, team) {
    return this.tiles[r * BOARD_LEN + c][team];
  }

  reveal(r, c, team) {
    const colors = this.tiles[r * BOARD_LEN + c];
    if (colors[team] === GREEN_TILE) {
      this.leftover -= 1;
    }
  }

  checkWin() {
    return this.leftover === 0;
  }

  isBlack(r, c, team) {
    return this.getTile(r, c, team) === BLACK_TILE;
  }

  isWhite(r, c, team) {
    return this.getTile(r, c, team) === WHITE_TILE;
  }

  isGreen(r, c, team) {
    return this.getTile(r, c, team) === GREEN_TILE;
  }

  genJson() {
    let result = { [RED]: [], [BLUE]: [] };
    for (let r = 0; r < BOARD_LEN; r++) {
      result[RED].push([])
      result[BLUE].push([])
      for (let c = 0; c < BOARD_LEN; c++) {
        result[RED][r].push({ color: this.getTile(r, c, RED) });
        result[BLUE][r].push({ color: this.getTile(r, c, BLUE) });
      }
    }
    return result;
  }

  json(team) {
    return { keycard: this.jsonObj[team] };
  }
}

module.exports = KeyCard;