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
  CAPTAIN_ROLE: "captain",
};

const duet = {
  MIN_PLAYERS: 2,
  NO_TEAM: "",
  RED: "red",
  BLUE: "blue",
  FIRST_TURN: "ft",
  SUDDEN_DEATH: "sd",

  GREEN_TILE: 'g',
  WHITE_TILE: 'y',
  BLACK_TILE: 'x',

  N_GREEN_GREEN_TILES: 3,
  N_WHITE_WHITE_TILES: 7,
  N_BLACK_BLACK_TILES: 1,
  
  N_GREEN_WHITE_TILES: 5,
  N_WHITE_GREEN_TILES: 5,

  N_GREEN_BLACK_TILES: 1,
  N_BLACK_GREEN_TILES: 1,

  N_WHITE_BLACK_TILES: 1,
  N_BLACK_WHITE_TILES: 1,

  DEFAULT_TIMER_TOKENS: 9,
  MAX_TIMER_TOKENS: 11,
};

module.exports = {
  CLASSIC: 'classic',
  classic,
  
  DUET: 'duet',
  duet,

  MIN_WORDS: 50,
  BOARD_LEN: 5,
}