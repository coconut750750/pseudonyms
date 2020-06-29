import React from 'react';

import Tip from '../tip/Tip';

export const RED = "red";
export const BLUE = "blue";
export const NO_TEAM = "";
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

export const classicTurnDescriptor = (turn) => <h6>{turn.replace(/^\w/, c => c.toUpperCase())} turn</h6>;

export const duetTurnDescriptor = (turn, clueActive) => {
  if (turn === FIRST_TURN) {
    return <h6>{"First clue"}<Tip duet right help="firstTurn"/></h6>;
  } else if (turn === SUDDEN_DEATH) {
    return <h6>{"Sudden Death"}<Tip duet right help="suddenDeath"/></h6>;
  }

  const teamName = turn.replace(/^\w/, c => c.toUpperCase());
  const otherTeamName = otherTeam(turn).replace(/^\w/, c => c.toUpperCase());
  if (!clueActive) {
    return <h6>{`${teamName} giving clue`}</h6>;
  } else {
    return <h6>{`${otherTeamName} guessing`}</h6>;
  }
}