export const BOARD_SIZE = 5;

export const RED = "red";
export const BLUE = "blue";
export const GREEN = "green";
export const NO_TEAM = "";
export const FIRST_TURN = "ft";
export const SUDDEN_DEATH = "sd";

export const STYLES = {
  colors: {
    [RED]: '#dc3545',
    [BLUE]: '#007bff',
    [GREEN]: '#28a745',
    black: '#000',
    white: '#999',
  },
  font: 'Roboto Mono, monospace',
  fontSize: 12,
}

export const RED_TILE = 'r';
export const BLUE_TILE = 'b';
export const WHITE_TILE = 'y';
export const BLACK_TILE = 'x';
export const GREEN_TILE = 'g';

export const LOBBY = "lobby";
export const TEAMS = "teams";
export const ROLES = "roles";
export const BOARD = "board";
export const RESULT = "result";

export const CLASSIC = "classic";
export const DUET = "duet";

export const isClassic = (mode) => mode === CLASSIC;
export const isDuet = (mode) => mode === DUET;

export const redTurn = (turn) => turn === RED;
export const blueTurn = (turn) => turn === BLUE;
export const firstTurn = (turn) => turn === FIRST_TURN;
export const suddenDeath = (turn) => turn === SUDDEN_DEATH;

export const otherTeam = (team) => {
  if (team !== RED && team !== BLUE) {
    return NO_TEAM;
  }
  return team === RED ? BLUE : RED;
}