function socketio(socket, game, name, player) {
  socket.on('startGame', data => {
    if (game.canStart() && player.isAdmin) {
      const { options } = data;
      try {
        game.start(options);
      } catch (err) {
        socket.emit('message', { message: err.message });
      }
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
    try {
      game.confirmTeams();
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

   socket.on('sendClue', data => {
    const { word, count } = data;
    if (Number.isNaN(parseInt(count))) {
      return;
    }
    try {
      if (game.canSendClue(player)) {
        game.addClue(player, word, parseInt(count));
      }
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('revealWord', data => {
    if (game.canReveal(player)) {
      const { r, c } = data;
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
    if (!game.started && player.isAdmin) {
      const { name } = data;
      game.removePlayer(name);
    }
  });
}

module.exports = socketio;
