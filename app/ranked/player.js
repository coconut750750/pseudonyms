const ClassicPlayer = require("../classic/player");
const { userProfile } = require("../db/profiles");

class Player extends ClassicPlayer {
  constructor(name, socket, isAdmin) {
    super(name, socket, isAdmin);
    this.profile = undefined;
  }

  async loadProfile(collection) {
    this.profile = await userProfile(collection, this.name);
  }

  json() {
    return {
      ...super.json(),
      profile: { ...this.profile },
    };
  }
}

module.exports = Player;