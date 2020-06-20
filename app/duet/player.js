const { RED, BLUE, NO_TEAM } = require('../common/const').duet;
const PlayerInterface = require('../common/player');

class Player extends PlayerInterface {
  constructor(name, socket, isAdmin) {
    super(name, socket, isAdmin);

    this.team = NO_TEAM;
  }

  setTeam(isRed) {
    this.team = isRed ? RED : BLUE;
  }

  isOnTeam(team) {
    return this.team === team;
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

  sendAsTeam(team, event, data) {
    if (this.socket !== undefined && this.team === team) {
      this.socket.emit(event, data);
    }
  }
}

module.exports = Player;