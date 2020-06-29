import { RED, BLUE, NO_TEAM } from '../utils/const';

var _ = require('lodash');

export default class Player {
  constructor(name, isAdmin, active, team, role) {
    this.name = name;
    this.isAdmin = isAdmin;
    this.active = active;
    this.team = team;
    this.role = role;
  }

  isRed() {
    return this.team === RED;
  }

  noTeam() {
    return this.team === NO_TEAM;
  }

  isBlue() {
    return this.team === BLUE;
  }

  isCaptain() {
    return this.role === "captain";
  }
}

export function getMeIndex(players, name) {
  return _.findIndex(players, { name });
}

export function getMePlayer(players, name) {
  return players[getMeIndex(players, name)];
}

export function newPlayer(playerJson) {
  return new Player(playerJson.name, playerJson.isAdmin, playerJson.active, playerJson.team, playerJson.role);
}