const { tryCatch } = require("../common/gameerror");

function socketio(socket, game, name, player) {
  socket.on('setCaptain', async data => {
    await game.reload();
    game.setCaptain(player);
    game.save();
  });

  socket.on('randomizeRoles', async data => {
    await game.reload();
    game.randomizeRoles(player);
    game.save();
  });

  socket.on('confirmRoles', async data => {
    await game.reload();
    tryCatch(
      () => {
        game.confirmRoles();
        game.save();
      },
      (err) => socket.emit('message', { message: err.message }),
    );
  });

  // retrieving info for reconnected clients
  socket.on('getReconnect', async data => {
    await game.reload();
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
