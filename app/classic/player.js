const { RED, BLUE, PLAYER_ROLE, KEY_ROLE, NO_TEAM } = require('../common/const').classic;
const PlayerInterface = require('../common/player');

class Player extends PlayerInterface {
  constructor(name, socket, isAdmin) {
    super(name, socket, isAdmin);

    this.team = NO_TEAM;
    this.role = PLAYER_ROLE;
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

  setKey() {
    this.role = KEY_ROLE;
  }

  isKey() {
    return this.role === KEY_ROLE;
  }

  resetRole() {
    this.role = PLAYER_ROLE;
  }

  json() {
    return {
      ...super.json(),
      team: this.team,
      role: this.role,
    };
  }

  sendAsKey(event, data) {
    if (this.socket !== undefined && this.role === KEY_ROLE) {
      this.socket.emit(event, data);
    }
  }
}

module.exports = Player;