class Player {
  constructor(name, socket, isAdmin) {
    this.name = name;
    this.socket = socket;
    this.isAdmin = isAdmin;
    this.active = true;

    this.team = "";
    this.role = "";
  }

  setTeam(team) {
    this.team = team;
  }

  setRole(role) {
    this.role = role;
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
    if (this.socket != undefined) {
      this.socket.emit(event, data);
    }
  }
}

module.exports = Player;