const mongoose = require('mongoose');

const c = require('../common/const');

const { BOARD_LEN } = c;
const { 
  RED,
  BLUE,
  GREEN_TILE, 
  WHITE_TILE, 
  BLACK_TILE, 
  N_GREEN_TILES,
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

class DuetKeyCardSchema extends mongoose.Schema {
  constructor() {
    super(arguments);
    mongoose.Schema.apply(this, arguments);
    this.add({
      tiles: [{
        _id : false,
        [RED]: {
          type: String,
          enum: [GREEN_TILE, WHITE_TILE, BLACK_TILE]
        }, 
        [BLUE]: {
          type: String,
          enum: [GREEN_TILE, WHITE_TILE, BLACK_TILE]
        }
      }],
      leftover: Number,
      teamLeftover: {
        [RED]: Number,
        [BLUE]: Number,
      },
    });
  }
}

class DuetKeyCard extends mongoose.Model {
  constructor() {
    super();
    this.tiles = [];
    this.leftover = N_GREEN_TILES;
    this.teamLeftover = {
      [RED]: 9,
      [BLUE]: 9,
    };

    this.generate();
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
      if (colors[RED] === GREEN_TILE) {
        this.teamLeftover[RED] -= 1;
      }
      if (colors[BLUE] === GREEN_TILE) {
        this.teamLeftover[BLUE] -= 1;
      }
    }
  }

  teamFinished(team) {
    return this.teamLeftover[team] === 0;
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

  json(team) {
    let result = { keycard: [] };
    for (let r = 0; r < BOARD_LEN; r++) {
      result.keycard.push([])
      for (let c = 0; c < BOARD_LEN; c++) {
        const color = this.getTile(r, c, team);
        result.keycard[r].push({ color: { [team]: color } });
      }
    }
    return result;
  }

  jsonMerged() {
    let result = { keycard: [] };
    for (let r = 0; r < BOARD_LEN; r++) {
      result.keycard.push([])
      for (let c = 0; c < BOARD_LEN; c++) {
        const redColor = this.getTile(r, c, RED);
        const blueColor = this.getTile(r, c, BLUE);
        result.keycard[r].push({ color: { red: redColor, blue: blueColor } });
      }
    }
    return result;
  }
}

const schema = new DuetKeyCardSchema();
schema.loadClass(DuetKeyCard);
const DuetKeyCardModel = mongoose.model(DuetKeyCard, schema);

module.exports = {
  DuetKeyCardModel,
  DuetKeyCardSchema: schema,
};