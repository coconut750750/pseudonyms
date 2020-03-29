const fs = require('fs');
const path = require("path");

function wordsFromFile(wordfile) {
  const filepath = path.join(__dirname, `../wordfiles/${wordfile}`);
  const contents = fs.readFileSync(filepath, 'utf8');
  const words = contents.trim().split(/\r?\n/);
  return words;
}

class WordList {
  constructor(wordfile) {
    this.load(wordfile);
  }

  load(wordfile) {
    this.words = wordsFromFile(wordfile);
  }

  getRandomWords(n) {
    var result = new Array(n);
    var len = this.words.length;
    var taken = new Array(len);

    if (n > len) {
      throw new RangeError("getRandom: more elements taken than available");
    }

    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = this.words[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }

    return result;
  }
}

module.exports = WordList;