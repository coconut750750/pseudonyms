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

  socket.on('setKey', data => {
    if (game.canSetRole()) {
      game.setKey(name);
    }
  });

  socket.on('confirmRoles', data => {
    try {
      game.confirmRoles();
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  socket.on('sendClue', data => {
    const { word, count } = data;
    if (game.canSendClue(player)) {
      try {
        game.addClue(word, count);
      } catch (err) {
        socket.emit('message', { message: err.message });
      }
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
    if (game.phase !== 'board') {
      game.reset();
    }
  });

  socket.on('removePlayer', data => {
    if (!game.started && player.isAdmin) {
      const { name } = data;
      game.removePlayer(name);
    }
  });

  // retrieving info for reconnected clients
  socket.on('getReconnect', data => {
    game.reconnectSendBoard(player);
    game.reconnectSendKey(player);
    game.reconnectSendTurn(player);
    game.reconnectSendClue(player);
    game.reconnectSnedGuessesLeft(player);
    game.reconnectSendScore(player);
    game.reconnectSendWinner(player);
    socket.emit('phase', { phase: game.phase });
  });
}

module.exports = socketio;
