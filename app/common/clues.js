const _ = require('lodash');
const { ClueModel } = require('./clue');

class Clues {
  constructor(notifyClue) {
    this.notifyClue = notifyClue;
    this.clear();
  }

  clear() {
    this.clues = [];
    this.currentActive = false;
  }

  length() {
    return this.clues.length;
  }

  add(word, count, team) {
    const clue = new ClueModel(word, count, team);
    this.clues.push(clue);
    this.currentActive = true;
    this.notifyClue();
  }

  getCurrent() {
    return this.currentClue;
  }

  currentExists() {
    return this.currentActive;
  }

  resetCurrent() {
    this.currentActive = false;
  }

  json() {
    const current = this.currentExists() ? this.clues[this.clues.length - 1] : undefined;
    let res = { current: current?.json(), clues: [] };
    for (var clue of this.clues) {
      res.clues.push(clue.json());
    }
    return res;
  }
}

module.exports = Clues;