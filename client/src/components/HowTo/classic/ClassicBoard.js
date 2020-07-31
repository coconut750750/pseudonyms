import React from 'react';

import ClassicBoard from '../../../game_components/classic/ClassicBoard';
import { newBoard } from '../../../models/board';
import { newKey } from '../../../models/keycard';
import Toggle from '../../../input_components/Toggle';

const {
  BOARD_SIZE,
  RED_TILE: R,
  BLUE_TILE: B,
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
  const colors = [B,Y,R,B,Y,Y,R,Y,B,R,R,Y,R,R,B,X,Y,B,R,R,R,B,B,Y,B];
  let keycard = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    keycard.push([]);
    for (let j = 0; j < BOARD_SIZE; j++) {
      keycard[i].push({color: colors[i * BOARD_SIZE + j]});
    }
  }
  return newKey(keycard);
})();

const basicReveals = () => {
  return [[0, 2], [1, 4]].map(([r, c]) => ({r, c, color: keycard.get(r, c)}));
};

const allReveals = () => {
  return [[0, 2], [1, 4], [0, 0], [0, 1], [4, 4], [2, 2], [4, 0], [0, 3], [1, 3], [2, 0], [3, 3], [2, 4], [3, 2], [4, 1], [4, 2], [1, 1], [4, 3]].map(([r, c]) => ({r, c, color: keycard.get(r, c)}));
};

export default function HowToClassicBoard({ captainView, toggleCaptainView, reveal, revealAll }) {
  let reveals = [];
  if (reveal) {
    reveals = reveals.concat(basicReveals());
  }
  if (revealAll) {
    reveals = reveals.concat(allReveals());
  }
  
  return (
    <div className="how-to-classic-board">
      <div className="row d-flex justify-content-center align-items-center">
        <h6 className="text-center mr-3">{captainView ? "Captains' screen" : "Players' screen"}</h6>
        <Toggle clicked={captainView} onClick={toggleCaptainView}/>
      </div>
      <ClassicBoard
        revealWord={ () => {} }
        board={board}
        reveals={reveals}
        keycard={captainView ? keycard : undefined}
        showKey={captainView}
        canReveal={false}/>
    </div>
  );
}