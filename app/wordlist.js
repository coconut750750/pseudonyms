const fs = require('fs');
const path = require("path");

const { MIN_WORDS } = require('./const');

function wordsFromFile(wordfile) {
  const filepath = path.join(__dirname, `../wordfiles/${wordfile}`);
  const contents = fs.readFileSync(filepath, 'utf8');
  const words = contents.trim().toLowerCase().split(/\r?\n/);
  return words;
}

class WordList {
  constructor(wordfile, customWords) {
    if (wordfile !== undefined) {
      this.loadFile(wordfile);
    } else {
      this.loadString(customWords);
    }
    if (this.words.length < MIN_WORDS) {
      throw new Error("Not enough words!");
    }
  }

  loadFile(wordfile) {
    this.words = wordsFromFile(wordfile);
  }

  loadString(string) {
    this.words = string.trim().toLowerCase().split(/\r?\n/);
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