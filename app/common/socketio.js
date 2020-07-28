const { tryCatch } = require("../common/gameerror");

function socketio(socket, game, name, player) {
  socket.on('startGame', data => {
    if (game.canStart() && player.isAdmin) {
      const { options } = data;
      tryCatch(
        () => game.start(options),
        (err) => socket.emit('message', { message: err.message }),
      );
    }
  });

  socket.on('selectTeam', data => {
    if (game.canSetTeam()) {
      const { team } = data;
      game.setTeam(name, team === 'red');
    }
  });

  socket.on('randomizeTeams', data => {
    if (game.canSetTeam()) {
      game.randomizeTeams();
    }
  });

  socket.on('confirmTeams', data => {
    tryCatch(
      () => game.confirmTeams(),
      (err) => socket.emit('message', { message: err.message }),
    );
  });

   socket.on('sendClue', data => {
    const { word, count } = data;
    if (word === undefined || count === undefined) {
      return;
    }
    if (Number.isNaN(parseInt(count))) {
      return;
    }
    tryCatch(
      () => {
        if (game.canSendClue(player)) {
          game.addClue(player, word, parseInt(count));
        }
      },
      (err) => socket.emit('message', { message: err.message }),
    );
  });

  socket.on('revealWord', data => {
    if (game.canReveal(player)) {
      const { r, c } = data;
      if (r === undefined || c === undefined) {
        return;
      }
      game.reveal(r, c);
    }
  });

  socket.on('endTurn', data => {
    if (game.canEndTurn(player)) {
      game.endTurn();
    }
  });

  socket.on('newGame', data => {
    if (game.canReset()) {
      game.reset();
    }
  });

  socket.on('removePlayer', data => {
    const { name } = data;
    if (player.isAdmin) {
      if (!game.hasStarted() || game.canRemove(name)) {
        game.removePlayer(name);
      }
    }
  });
}

module.exports = socketio;
