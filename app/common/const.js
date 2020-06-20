const classic = {
  MIN_PLAYERS: 4,
  NO_TEAM: "",
  RED: "red",
  BLUE: "blue",

  RED_TILE: 'r',
  BLUE_TILE: 'b',
  WHITE_TILE: 'y',
  BLACK_TILE: 'x',

  N_START_TILES: 9,
  N_OTHER_TILES: 8,
  N_WHITE_TILES: 7,
  N_BLACK_TILES: 1,

  PLAYER_ROLE: "player",
  KEY_ROLE: "key",
};

const duet = {
  MIN_PLAYERS: 2,
  NO_TEAM: "",
  RED: "red",
  BLUE: "blue",

  GREEN_TILE: 'g',
  WHITE_TILE: 'y',
  BLACK_TILE: 'x',

  N_GREEN_GREEN_TILES: 3,
  N_GREEN_WHITE_TILES: 5 * 2,
  N_GREEN_BLACK_TILES: 1 * 2,
  N_WHITE_BLACK_TILES: 1 * 2,
  N_BLACK_BLACK_TILES: 1,
  N_WHITE_WHITE_TILES: 7,
};

module.exports = {
  classic,
  duet,
  MIN_WORDS: 50,
  BOARD_LEN: 5,
}