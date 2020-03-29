var _ = require('lodash');
const Player = require('./player');

function PlayerList(notifyUpdate, endGame) {
  var players = [];

  const get = (name) => {
    return _.filter(players, p => p.name == name)[0];
  };

  const getAll = () => {
    return players;
  }

  const exists = (name) => {
    return _.filter(players, p => p.name == name).length > 0;
  }

  const add = (name, socket) => {
    players.push(new Player(
      name,
      socket,
      players.length === 0
    ));
    notifyUpdate();
  }

  const activate = (name, socket) => {
    get(name).activate(socket);
    notifyUpdate();
  }

  const deactivate = (name) => {
    get(name).deactivate();
    if (allDeactivated()) {
      endGame();
    } else {
      notifyUpdate();
    }
  }

  const allDeactivated = () => {
    for (var p of players) {
      if (p.active) { return false; }
    }
    return true;
  }

  const isActive = (name) => {
    return get(name).active;
  }

  const remove = (name) => {
    var removedPlayer = _.remove(players, p => p.name == name);
    if (allDeactivated()) {
      endGame();
    } else {
      notifyUpdate();
    }
  }

  const resetTeams = () => {
    for (var p of players) {
      p.resetTeam();
    }
    notifyUpdate();
  }

  const setTeam = (name, isRed) => {
    get(name).setTeam(isRed);
    notifyUpdate();
  }

  const randomizeTeams = () => {
    const n = players.length;
    let nRed = Math.floor(n/2);
    let nBlue = Math.floor(n/2);
    if (n & 1 === 1) {
        const r = Math.floor(Math.random() * 2);
        nRed += (1 - r);
        nBlue += r;
    }

    for (var p of players) {
        if (nRed === 0) {
            p.setTeam(false);
        } else if (nBlue === 0) {
            p.setTeam(true);
        } else {
            const isRed = Math.random() > 0.5;
            p.setTeam(isRed);
            nRed -= isRed;
            nBlue -= (1 - isRed);
        }
    }

    notifyUpdate();
  }

  const resetRoles = () => {
    for (var p of players) {
      p.resetRole();
    }
    notifyUpdate();
  }

  const setKey = (name) => {
    for (var p of players) {
      if (p.team === get(name).team) {
        p.resetRole();
      }
    }
    get(name).setKey();
    notifyUpdate();
  }

  return {
    get,
    getAll,
    exists,
    add,
    activate,
    deactivate,
    isActive,
    remove,
    resetTeams, 
    setTeam,
    randomizeTeams,
    resetRoles, 
    setKey,
  }
}

module.exports = PlayerList;