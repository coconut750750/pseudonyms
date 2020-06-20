class Clue {
  constructor(word, count, team) {
    this.word = word;
    this.count = count;
    this.team = team;
  }

  json() {
    return { word: this.word, count: this.count, team: this.team };
  }
}

module.exports = Clue;