export const RED = "red";
export const BLUE = "blue";
export const FIRST_TURN = "ft";
export const SUDDEN_DEATH = "sd";

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

export const redTurn = (turn) => turn === RED;
export const blueTurn = (turn) => turn === BLUE;
export const firstTurn = (turn) => turn === FIRST_TURN;
export const suddenDeath = (turn) => turn === SUDDEN_DEATH;

export const otherTeam = (team) => {
  return team === RED ? BLUE : RED;
}

export const classicTurnDescriptor = (turn) => `${turn.replace(/^\w/, c => c.toUpperCase())} turn`

export const duetTurnDescriptor = (turn, clueActive) => {
  if (turn === FIRST_TURN) {
    return "First clue";
  } else if (turn === SUDDEN_DEATH) {
    return "Sudden Death";
  }
  const teamName = turn.replace(/^\w/, c => c.toUpperCase());
  const otherTeamName = otherTeam(turn).replace(/^\w/, c => c.toUpperCase());
  if (!clueActive) {
    return `${teamName} giving clue`;
  } else {
    return `${otherTeamName} guessing`;
  }
}