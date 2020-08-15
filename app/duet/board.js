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
      revealedInts: [Number],
    });
  }
}

class DuetBoardClass extends BoardClass {
  constructor(wordlist, notifyReveal) {
    super(wordlist);

    this.revealedMatrix = [];
    for (var i = 0; i < BOARD_LEN * BOARD_LEN; i++) { this.revealedMatrix.push(new Set()) };
    this.revealed = [];

    this.jsonObj = this.genJson();
    this.notifyReveal = notifyReveal;
  }

  isRevealed(r, c, team) {
    return this.revealedMatrix[this.coordToIndex(r, c)].has(team);
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
      this.revealedMatrix[index].add(RED);
      this.revealedMatrix[index].add(BLUE);
    } else {
      this.revealedMatrix[index].add(team);
    }
    this.revealed.push({ r, c, team });
    this.notifyReveal(r, c, team);
  }
}

const schema = new DuetBoardSchema();
schema.loadClass(DuetBoardClass);
const DuetBoardModel = mongoose.model(DuetBoardClass, schema);

module.exports = DuetBoardModel;