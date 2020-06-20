function socketio(socket, game, name, player) {

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
