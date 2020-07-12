const ClassicGame = require("../classic/game");
const PlayerList = require("./playerlist");

const { findByUsername, completeGame } = require('../db/users');
const c = require('../common/const');
const { RANKED } = c;
const { RED, BLUE } = c.classic;

class RankedGame extends ClassicGame {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast, PlayerList);
    this.usersCollection = options.usersCollection;
    this.plist.setCollection(this.usersCollection);
  }

  mode() {
    return RANKED;
  }

  checkName(req, name) {
    if (req.user === undefined) {
      throw new Error('Must be logged in');
    }
  }

  endGame(winner, matured) {
    super.endGame(winner, matured);
    this.updateRanks(winner);
  }

  async getUserData() {
    let users = {};
    for (let p of this.plist.getAll()) {
      if (p.isOnTeam(RED) || p.isOnTeam(BLUE)) {
        const user = await findByUsername(this.usersCollection, p.name);
        users[p.name] = user;
      }
    }
    return users;
  }

  async getTeamRanks(users) {
    let redTeamRank = 0;
    let blueTeamRank = 0;

    for (let p of this.plist.getAll()) {
      if (p.isOnTeam(RED) || p.isOnTeam(BLUE)) {
        const ranking = users[p.name].ranking;
        if (p.isOnTeam(RED)) {
          redTeamRank += ranking;
        } else if (p.isOnTeam(BLUE)) {
          blueTeamRank += ranking;
        }
      }
    }

    redTeamRank = redTeamRank / this.plist.teamCount(RED);
    blueTeamRank = blueTeamRank / this.plist.teamCount(BLUE);
    return { [RED]: redTeamRank, [BLUE]: blueTeamRank };
  }

  calculateNewRank(user, player, teamRank, opponentRank, win) {
    const actual = win ? 1 : 0;
    const p = 1 / (1 + Math.pow(10, ((teamRank - opponentRank) / 400)))
    const confidenceWeight = 1 / Math.log(user.games + 2); // plus 2 to avoid log(0) and 1/log(1)

    // dominance factor = user rank / avg team rank
    // if win, dominating players gain less (divide delta by this factor)
    // if lose, dominating players, lose more (multiply delta by this factor)
    // (-1)^actual will flip the dominance factor
    const dominanceWeight = Math.pow(user.ranking / teamRank, Math.pow(-1, actual));
    const delta = 30 * confidenceWeight * (actual - p);

    const newRank = Math.max(user.ranking + delta * dominanceWeight, 0);
    return Math.round(newRank);
  }

  async updateRanks(winner) {
    const users = await this.getUserData();
    const teamRanks = await this.getTeamRanks(users);
    Promise.all(this.plist.getAll().map(async p => {
      if (p.isOnTeam(RED) || p.isOnTeam(BLUE)) {
        const win = p.isOnTeam(winner);
        const teamRank = teamRanks[p.team];
        const opponentRank = p.isOnTeam(RED) ? teamRanks[BLUE] : teamRanks[RED];

        const newRank = this.calculateNewRank(users[p.name], p, teamRank, opponentRank, win);
        return await completeGame(this.usersCollection, p.name, win, newRank);
      }
    })).then(() => this.plist.reloadProfiles());
  }
}

module.exports = RankedGame;