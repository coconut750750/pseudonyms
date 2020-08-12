class Player {
  constructor(name, sid, isAdmin) {
    this.name = name;
    this.sid = sid;
    this.isAdmin = isAdmin;
    this.active = true;
  }

  activate(sid) {
    this.active = true;
    this.sid = sid;
  }

  deactivate() {
    this.active = false;
    this.sid = undefined;
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

  send(event, data, emitter) {
    if (this.sid !== undefined) {
      emitter(this.sid, event, data);
    }
  }
}

module.exports = Player;