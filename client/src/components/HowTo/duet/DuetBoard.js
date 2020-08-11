import React from 'react';

import DuetBoard from '../../../game_components/duet/DuetBoard';
import { newBoard } from '../../../models/board';
import { newKey } from '../../../models/keycard';
import Toggle from '../../../input_components/Toggle';

const {
  RED,
  BLUE,
  BOARD_SIZE,
  GREEN_TILE: G,
  WHITE_TILE: Y,
  BLACK_TILE: X,
} = require('../../../utils/const');

const board = (() => {
  const words = ['HOLLYWOOD','SCREEN','PLAY','MARBLE','DINOSAUR','CAT','PITCH','BOND','GREECE','DECK','SPIKE','CENTER','VACUUM','UNICORN','UNDERTAKER','TOOTH','FAIR','WELL','SHOT','BILL','STAFF','SQUARE','PAN','KING','CHICK'];
  let board = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    board.push([]);
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i].push({word: words[i * BOARD_SIZE + j].toLowerCase()});
    }
  }
  return newBoard(board);
})();

const keycard = (() => {
  const colors = [[Y,Y],[G,Y],[X,Y],[Y,Y],[Y,G],[Y,Y],[Y,Y],[G,G],[G,Y],[Y,G],[X,X],[G,Y],[Y,Y],[Y,G],[Y,G],[Y,Y],[Y,X],[G,G],[G,G],[Y,Y],[Y,G],[X,G],[G,X],[G,Y],[G,Y]];
  let keycard = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    keycard.push([]);
    for (let j = 0; j < BOARD_SIZE; j++) {
      const c = colors[i * BOARD_SIZE + j];
      keycard[i].push({ color: { red: c[0], blue: c[1] }});
    }
  }
  return newKey(keycard);
})();

const basicReveals = () => {
  return [
    { r: 4, c: 2, color: G, team: RED },
    { r: 4, c: 4, color: G, team: RED },
  ];
};

const incorrectReveals = () => {
  return [
    { r: 4, c: 0, color: Y, team: RED },
    { r: 1, c: 3, color: Y, team: BLUE },
    { r: 1, c: 1, color: Y, team: RED },
    { r: 1, c: 1, color: Y, team: BLUE },
  ];
};

const allReveals = () => {
  let reveals = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const key = keycard.get(i, j);
      if (key.red === G) {
        reveals.push({ r: i, c: j, color: G, team: RED });
      } else if (key.blue === G) {
        reveals.push({ r: i, c: j, color: G, team: BLUE });
      }
    }
  }
  return reveals;
};

export default function HowToDuetBoard({ blueTeamView, toggleTeamView, reveal, incorrectReveal, revealAll }) {
  let reveals = [];
  let otherTeam = undefined;
  if (reveal) {
    reveals = reveals.concat(basicReveals());
  }
  if (incorrectReveal) {
    reveals = reveals.concat(incorrectReveals());
  }
  if (revealAll) {
    reveals = reveals.concat(allReveals());
    otherTeam = blueTeamView ? RED : BLUE;
  }

  return (
    <div className="how-to-classic-board">
      <div className="row d-flex justify-content-center align-items-center">
        <h6 className="text-center mr-3">{blueTeamView ? "Blue": "Red"} team's screen</h6>
        <Toggle clicked={blueTeamView} onClick={toggleTeamView}/>
      </div>
      <DuetBoard
        team={blueTeamView ? BLUE : RED}
        revealWord={ () => {} }
        board={board}
        reveals={reveals}
        keycard={keycard}
        canReveal={false}
        otherTeam={otherTeam}/>
    </div>
  );
}