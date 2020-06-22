import React from 'react';

import Hint from '../hint/Hint';

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

export const classicTurnDescriptor = (turn) => <h6>{turn.replace(/^\w/, c => c.toUpperCase())} turn</h6>;

export const duetTurnDescriptor = (turn, clueActive) => {
  if (turn === FIRST_TURN) {
    return <h6>{"First clue"}<Hint duet help="firstTurn"/></h6>;
  } else if (turn === SUDDEN_DEATH) {
    return <h6>{"Sudden Death"}<Hint duet help="suddenDeath"/></h6>;
  }

  const teamName = turn.replace(/^\w/, c => c.toUpperCase());
  const otherTeamName = otherTeam(turn).replace(/^\w/, c => c.toUpperCase());
  if (!clueActive) {
    return <h6>{`${teamName} giving clue`}</h6>;
  } else {
    return <h6>{`${otherTeamName} guessing`}</h6>;
  }
}