class GameStatsInterface {
  constructor() {
    this.turns = 0;
    
    this.timeInSec = 0;
    this.startTime = undefined;
    this.timeTrend = [];
  }

  startGame() {
    this.startTime = new Date();
  }

  addTurn() {
    this.turns += 1;

    const time = (new Date() - this.startTime) / 1000;
    this.timeTrend.push(time);
  }

  endGame() {
    this.timeInSec = (new Date() - this.startTime) / 1000;
  }
}

module.exports = GameStatsInterface;
