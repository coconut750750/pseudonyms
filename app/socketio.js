function socketio(socket, game, name, player) {
  socket.on('startGame', data => {
    if (game.canStart() && player.isAdmin) {
      const { options } = data;
      if (game.enoughPlayers()) {
        try {
          game.start(options);
        } catch (err) {
          socket.emit('message', { message: err.message });
        }
      } else {
        socket.emit('message', { message: 'Not enough players have joined the game' });
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
    game.confirmTeams();
  });

  socket.on('setKey', data => {
    if (game.canSetRole()) {
      game.setKey(name);
    }
  });

  socket.on('confirmRoles', data => {
    game.confirmRoles();
  });

  socket.on('sendClue', data => {
    const { word, count } = data;
    if (game.canSendClue(player)) {
      if (game.validClue(word)) {
        game.addClue(word, count);
      } else {
        socket.emit('message', { message: 'Invalid Clue!' });
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
    if (!game.started || player.isAdmin) {
      game.reset();
    }
  });

  socket.on('removePlayer', data => {
    if (!game.started || player.isAdmin) {
      const { name } = data;
      game.removePlayer(name);
    }
  });

  // retrieving info for reconnected clients
  socket.on('getPhase', data => {
    if (game.phase !== 'lobby') {
      socket.emit('phase', { phase: game.phase });
    }
  });

  socket.on('getBoard', data => {
    game.connectSendBoard(player);
  });

  socket.on('getKey', data => {
    game.connectSendKey(player);
  });

  socket.on('getTurn', data => {
    game.connectSendTurn(player);
  });

  socket.on('getClue', data => {
    game.connectSendClue(player);
  });

  socket.on('getScore', data => {
    game.connectSendScore(player);
  });

  socket.on('getWinner', data => {
    game.connectSendWinner(player);
  });
}

module.exports = socketio;
