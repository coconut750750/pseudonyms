class GameError extends Error {
  constructor(message) {
    super(message);
  }
}

function tryCatch(func, onError) {
  try {
    func();
  } catch (err) {
    if (err instanceof GameError) {
      onError(err);
    } else {
      throw err;
    }
  }
}

module.exports = {
  GameError,
  tryCatch,
};