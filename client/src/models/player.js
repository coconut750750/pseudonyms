import { RED, BLUE, NO_TEAM } from '../utils/const';

var _ = require('lodash');

export default class Player {
  constructor(playerJson) {
    this.name = playerJson.name;
    this.isAdmin = playerJson.isAdmin;
    this.active = playerJson.active;
    this.team = playerJson.team;
    this.role = playerJson.role;

    this.profile = playerJson.profile;
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
  return new Player(playerJson);
}