const { tryCatch } = require("../common/gameerror");

function socketio(socket, game, name, player) {
  socket.on('startGame', data => {
    if (game.canStart() && player.isAdmin) {
      const { options } = data;
      tryCatch(
        () => {
          game.start(options);
          game.save();
        },
        (err) => socket.emit('message', { message: err.message }),
      );
    }
  });

  socket.on('selectTeam', data => {
    if (game.canSetTeam()) {
      const { team } = data;
      game.setTeam(name, team === 'red');
      game.save();
    }
  });

  socket.on('randomizeTeams', data => {
    if (game.canSetTeam()) {
      game.randomizeTeams();
      game.save();
    }
  });

  socket.on('confirmTeams', data => {
    tryCatch(
      () => {
        game.confirmTeams();
        game.save();
      },
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
          game.save();
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
      game.save();
    }
  });

  socket.on('endTurn', data => {
    if (game.canEndTurn(player)) {
      game.endTurn();
      game.save();
    }
  });

  socket.on('newGame', data => {
    if (game.canReset()) {
      game.reset();
      game.save();
    }
  });

  socket.on('removePlayer', data => {
    const { name } = data;
    if (player.isAdmin) {
      if (!game.hasStarted() || game.canRemove(name)) {
        game.removePlayer(name);
        game.save();
      }
    }
  });
}

module.exports = socketio;
