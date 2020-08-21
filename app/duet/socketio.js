function socketio(socket, game, name, withLock) {
  socket.on('revealWord', data => {
    withLock(
      async () => {
        await game.reload();
        const player = game.getPlayer(name);
        if (game.canSuddenDeathReveal(player)) {
          const { r, c } = data;
          if (r === undefined || c === undefined) {
            return;
          }
          game.suddenDeathReveal(player, r, c);
          game.save();
        }
      }, () => {}
    );
  });

  // retrieving info for reconnected clients
  socket.on('getReconnect', data => {
    withLock(
      async () => {
        await game.reload();
        const player = game.getPlayer(name);
        game.reconnectSendBoard(player);
        game.reconnectSendKey(player);
        game.reconnectSendTurn(player);
        game.reconnectSendClue(player);
        game.reconnectSendScore(player);
        game.reconnectSendWin(player);
      }, () => {
        socket.emit('phase', { phase: game.phase });
      }
    );
  });
}

module.exports = socketio;
