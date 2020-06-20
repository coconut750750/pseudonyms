function socketio(socket, game, name, player) {
  socket.on('revealWord', data => {
    if (game.canSuddenDeathReveal()) {
      const { r, c } = data;
      game.suddenDeathReveal(player, r, c);
    }
  });

  // retrieving info for reconnected clients
  socket.on('getReconnect', data => {
    game.reconnectSendBoard(player);
    game.reconnectSendKey(player);
    game.reconnectSendTurn(player);
    game.reconnectSendClue(player);
    game.reconnectSendScore(player);
    game.reconnectSendWin(player);
    socket.emit('phase', { phase: game.phase });
  });
}

module.exports = socketio;
