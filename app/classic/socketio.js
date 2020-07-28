const { tryCatch } = require("../common/gameerror");

function socketio(socket, game, name, player) {
  socket.on('setCaptain', data => {
    game.setCaptain(player);
  });

  socket.on('randomizeRoles', data => {
    game.randomizeRoles(player);
  });

  socket.on('confirmRoles', data => {
    tryCatch(
      () => game.confirmRoles(),
      (err) => socket.emit('message', { message: err.message }),
    );
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
