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

  const resetRoles = () => {
    for (var p of players) {
      p.resetRole();
    }
    notifyUpdate();
  }

  const setKey = (name) => {
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
    resetRoles, 
    setKey,
  }
}

module.exports = PlayerList;