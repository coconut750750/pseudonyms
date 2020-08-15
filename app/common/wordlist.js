const fs = require('fs');
const path = require("path");

const { GameError } = require("./gameerror");
const { MIN_WORDS } = require('./const');

const basePath = path.join(__dirname, `./wordfiles/`);

function wordsFromFile(wordfile) {
  const safeSuffix = path.normalize(wordfile).replace(/^(\.\.(\/|\\|$))+/, '');
  const filepath = path.join(basePath, safeSuffix);
  if (!fs.existsSync(filepath)) {
    throw new GameError("Provided wordlist is not a valid option");
  }

  const stats = fs.statSync(filepath);
  if (!stats.isFile()) {
    throw new GameError("Provided wordlist is not a valid option");
  }

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
      throw new GameError(`Please provide at least ${MIN_WORDS} words`);
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