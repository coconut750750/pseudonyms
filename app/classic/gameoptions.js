const mongoose = require('mongoose');

const { GameOptionsSchema, GameOptionsClass } = require("../common/gameoptions");

class ClassicGameOptions extends GameOptionsClass{
  constructor(options) {
    const { clueLimit, guessLimit, wordlist, customWords } = options;
    super(clueLimit, guessLimit, wordlist, customWords)
  }
}

const schema = new GameOptionsSchema();
schema.loadClass(ClassicGameOptions);
const ClassicGameOptionsModel = mongoose.model(ClassicGameOptions, schema);

module.exports = {
  ClassicGameOptionsSchema: schema,
  ClassicGameOptionsModel,
};