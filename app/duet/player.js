const { RED, BLUE, NO_TEAM } = require('../common/const').duet;
const PlayerInterface = require('../common/player');

class Player extends PlayerInterface {
  constructor(name, sid, isAdmin) {
    super(name, sid, isAdmin);

    this.team = NO_TEAM;
  }

  setTeam(isRed) {
    this.team = isRed ? RED : BLUE;
  }

  assignedTeam() {
    return this.team !== NO_TEAM;
  }

  resetTeam() {
    this.team = NO_TEAM;
  }

  json() {
    return {
      ...super.json(),
      team: this.team,
    };
  }

  sendAsTeam(team, event, data, emitter) {
    if (this.team === team) {
      this.send(event, data, emitter);
    }
  }
}

module.exports = Player;