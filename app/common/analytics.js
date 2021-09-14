class GameStatsInterface {
  constructor() {
    this.turns = 0;
    
    this.timeInSec = 0;
    this.startTime = undefined;
    
    this.clueEndTimes = [];
    this.guessEndTimes = [];
  }

  startGame() {
    this.startTime = new Date();
  }

  addClue() {
    const time = (new Date() - this.startTime) / 1000;
    this.clueEndTimes.push(time);
  }

  addTurn() {
    this.turns += 1;

    const time = (new Date() - this.startTime) / 1000;
    this.guessEndTimes.push(time);
  }

  endGame() {
    this.timeInSec = (new Date() - this.startTime) / 1000;
  }
}

module.exports = GameStatsInterface;
