const mongoose = require('mongoose');

const c = require('../common/const');

const { BOARD_LEN } = c;
const { 
  RED, 
  BLUE, 
  RED_TILE, 
  BLUE_TILE, 
  WHITE_TILE, 
  BLACK_TILE, 
  N_START_TILES,
  N_OTHER_TILES,
  N_WHITE_TILES,
  N_BLACK_TILES, } = c.classic;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class ClassicKeyCardSchema extends mongoose.Schema {
  constructor() {
    super(arguments);
    mongoose.Schema.apply(this, arguments);
    this.add({
      start: {
        type: String,
        enum: [RED, BLUE]
      },
      tiles: [{
        type: String,
        enum: [RED_TILE, BLUE_TILE, WHITE_TILE, BLACK_TILE]
      }],
      redLeft: Number,
      blueLeft: Number,
    });
  }
}

class ClassicKeyCard extends mongoose.Model{
  constructor() {
    super();
    this.start = Math.floor(Math.random() * 2) === 0 ? RED : BLUE;
    this.tiles = [];
    this.generate();
  }

  generate() {
    for (var i = 0; i < N_START_TILES; i++) { this.tiles.push(this.start === RED ? RED_TILE : BLUE_TILE) };
    for (var i = 0; i < N_OTHER_TILES; i++) { this.tiles.push(this.start === RED ? BLUE_TILE : RED_TILE) };
    for (var i = 0; i < N_WHITE_TILES; i++) { this.tiles.push(WHITE_TILE) };
    for (var i = 0; i < N_BLACK_TILES; i++) { this.tiles.push(BLACK_TILE) };
    shuffle(this.tiles);

    this.redLeft = this.start === RED ? N_START_TILES : N_OTHER_TILES;
    this.blueLeft = this.start === BLUE ? N_START_TILES : N_OTHER_TILES;
  }

  getTile(r, c) {
    return this.tiles[r * BOARD_LEN + c];
  }

  reveal(r, c) {
    const color = this.tiles[r * BOARD_LEN + c];
    if (color === RED_TILE) {
      this.redLeft -= 1;
    } else if (color === BLUE_TILE) {
      this.blueLeft -= 1;
    }
  }

  checkWin() {
    if (this.redLeft === 0) {
      return RED;
    } else if (this.blueLeft === 0) {
      return BLUE;
    }
  }

  isBlack(r, c) {
    return this.getTile(r, c) === BLACK_TILE;
  }

  isWhite(r, c) {
    return this.getTile(r, c) === WHITE_TILE;
  }

  isRed(r, c) {
    return this.getTile(r, c) === RED_TILE;
  }

  isBlue(r, c) {
    return this.getTile(r, c) === BLUE_TILE;
  }

  json() {
    let result = { keycard : [] };
    for (let r = 0; r < BOARD_LEN; r++) {
      result.keycard.push([])
      for (let c = 0; c < BOARD_LEN; c++) {
        result.keycard[r].push({ color: this.getTile(r, c) });
      }
    }
    return result;
  }
}

const schema = new ClassicKeyCardSchema({
  strict: false
});
schema.loadClass(ClassicKeyCard);
const ClassicKeyCardModel = mongoose.model(ClassicKeyCard, schema);

module.exports = {
  ClassicKeyCardModel,
  ClassicKeyCardSchema: schema,
};
