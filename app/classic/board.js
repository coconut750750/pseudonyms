const _ = require('lodash');
const mongoose = require('mongoose');

const { BOARD_LEN } = require("../common/const");
const { BoardClass, BoardSchema } = require("../common/board")

class ClassicBoardSchema extends BoardSchema {
  constructor() {
    super();
    this.add({
      revealedInts: [Number],
    });
  }
}

class ClassicBoardClass extends BoardClass {
  constructor(wordlist) {
    super(wordlist);
    this.revealedInts = [];
  }

  isRevealed(r, c) {
    return this.revealedInts.includes(this.coordToIndex(r, c));
  }

  isValid(word) {
    const index = this.tiles.indexOf(word);
    return this.revealedInts.includes(index);
  }

  reveal(r, c) {
    if (this.isRevealed(r, c)) {
      return;
    }
    this.revealedInts.push(this.coordToIndex(r, c));
  }
}

const schema = new ClassicBoardSchema();
schema.loadClass(ClassicBoardClass);
const ClassicBoardModel = mongoose.model(ClassicBoardClass, schema);

module.exports = {
  ClassicBoardModel,
  ClassicBoardSchema: schema,
};