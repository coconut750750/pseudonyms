import React from 'react';

import ClassicBoard from '../game_components/ClassicBoard';

function Result(props) {
  return (
    <div>
      <h5>Results</h5>
      <h6>{`${props.winner.replace(/^\w/, c => c.toUpperCase())} wins!`}</h6>
      <br/>

      <ClassicBoard
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