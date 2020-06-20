class Player {
  constructor(name, socket, isAdmin) {
    this.name = name;
    this.socket = socket;
    this.isAdmin = isAdmin;
    this.active = true;
  }

  activate(socket) {
    this.active = true;
    this.socket = socket;
  }

  deactivate() {
    this.active = false;
    this.socket = undefined;
  }

  isOnTeam(team) {
    return this.team === team;
  }

  json() {
    return {
      name: this.name,
      isAdmin: this.isAdmin,
      active: this.active,
    };
  }

  send(event, data) {
    if (this.socket !== undefined) {
      this.socket.emit(event, data);
    }
  }
}

module.exports = Player;