const { RED, BLUE, PLAYER_ROLE, KEY_ROLE, NO_TEAM } = require('./const');

class Player {
  constructor(name, socket, isAdmin) {
    this.name = name;
    this.socket = socket;
    this.isAdmin = isAdmin;
    this.active = true;

    this.team = NO_TEAM;
    this.role = PLAYER_ROLE;
  }

  setTeam(isRed) {
    this.team = isRed ? RED : BLUE;
  }

  isOnTeam(team) {
    return this.team === team;
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

  activate(socket) {
    this.active = true;
    this.socket = socket;
  }

  deactivate() {
    this.active = false;
    this.socket = undefined;
  }

  json() {
    return {
      name: this.name,
      isAdmin: this.isAdmin,
      active: this.active,
      team: this.team,
      role: this.role,
    };
  }

  send(event, data) {
    if (this.socket !== undefined) {
      this.socket.emit(event, data);
    }
  }

  sendAsKey(event, data) {
    if (this.socket !== undefined && this.role === KEY_ROLE) {
      this.socket.emit(event, data);
    }
  }
}

module.exports = Player;