function socketio(socket, game, name, player) {
  socket.on('setCaptain', data => {
    if (game.canSetRole()) {
      game.setCaptain(name);
    }
  });

  socket.on('confirmRoles', data => {
    try {
      game.confirmRoles();
    } catch (err) {
      socket.emit('message', { message: err.message });
    }
  });

  // retrieving info for reconnected clients
  socket.on('getReconnect', data => {
    game.reconnectSendBoard(player);
    game.reconnectSendKey(player);
    game.reconnectSendTurn(player);
    game.reconnectSendClue(player);
    game.reconnectSendGuessesLeft(player);
    game.reconnectSendScore(player);
    game.reconnectSendWinner(player);
    socket.emit('phase', { phase: game.phase });
  });
}

module.exports = socketio;
