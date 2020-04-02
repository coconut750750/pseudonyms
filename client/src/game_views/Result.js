import React from 'react';

import Board from '../game_components/Board';

function Result(props) {
  return (
    <div>
      <h5>Results</h5>
      <h6>{`${props.winner.replace(/^\w/, c => c.toUpperCase())} wins!`}</h6>
      <br/>

      <Board
        players={props.players}
        revealWord={ (r, c) => {} }
        board={props.board}
        reveals={props.reveals}
        keycard={props.keycard}
        isKey={true}
        tilesActive={false}/>
      <br/>
    </div>
  );
}

export default Result;