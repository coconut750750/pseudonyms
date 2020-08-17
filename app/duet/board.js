const _ = require('lodash');
const mongoose = require('mongoose');

const c = require("../common/const");
const { BOARD_LEN } = c;
const { RED, BLUE } = c.duet;

const { BoardClass, BoardSchema } = require("../common/board")

class DuetBoardSchema extends BoardSchema {
  constructor() {
    super();
    this.add({
      revealed: {
        type: [{
           r: Number,
           c: Number,
           team: {
            type: String,
            enum: [RED, BLUE],
           }
        }],
        _id: false,
      },
      revealedMatrix: {
        type: [{
          type: [Object],
          _id: false,
        }],
        _id: false,
      },
    });
  }
}

class DuetBoardClass extends BoardClass {
  constructor(wordlist) {
    super(wordlist);

    this.revealedMatrix = [];
    for (var i = 0; i < BOARD_LEN * BOARD_LEN; i++) { this.revealedMatrix.push([]) };
    this.revealed = [];
  }

  isRevealed(r, c, team) {
    return (new Set(this.revealedMatrix[this.coordToIndex(r, c)])).has(team);
  }

  isValid(word) {
    const index = this.tiles.indexOf(word);
    const [r, c] = this.indexToCoord(index)
    return this.isRevealed(r, c, RED) && this.isRevealed(r, c, BLUE);
  }

  reveal(r, c, team, isGreen) {
    if (this.isRevealed(r, c, team)) {
      return;
    }
    const index = this.coordToIndex(r, c);

    if (isGreen) {
      this.revealedMatrix[index].push(RED);
      this.revealedMatrix[index].push(BLUE);
    } else {
      this.revealedMatrix[index].push(team);
    }
    this.markModified('revealedMatrix');
    this.revealed.push({ r, c, team });
  }
}

const schema = new DuetBoardSchema();
schema.loadClass(DuetBoardClass);
const DuetBoardModel = mongoose.model(DuetBoardClass, schema);

module.exports = {
  DuetBoardSchema: schema,
  DuetBoardModel,
};