const { tryCatch } = require("../common/gameerror");

function socketio(socket, game, name, withLock) {
  socket.on('setCaptain', data => {
    withLock(
      async () => {
        await game.reload();
        const player = game.getPlayer(name);
        game.setCaptain(player);
        game.save();
      }, () => {}
    );
  });

  socket.on('randomizeRoles', data => {
    withLock(
      async () => {
        await game.reload();
        const player = game.getPlayer(name);
        game.randomizeRoles(player);
        game.save();
      }, () => {}
    );
  });

  socket.on('confirmRoles', data => {
    withLock(
      async () => {
        await game.reload();
        tryCatch(
          () => {
            game.confirmRoles();
            game.save();
          },
          (err) => socket.emit('message', { message: err.message }),
        );
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
        game.reconnectSendGuessesLeft(player);
        game.reconnectSendScore(player);
        game.reconnectSendWinner(player);
      }, () => {
        socket.emit('phase', { phase: game.phase });
      }
    );
  });
}

module.exports = socketio;
