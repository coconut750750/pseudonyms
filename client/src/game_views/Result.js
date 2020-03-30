import React from 'react';

import Board from '../components/Board';

function Result(props) {
  return (
    <div>
      <h5>Game Over</h5>
      <p>{`${props.winner === 'red' ? "Red" : "Blue"} wins!`}</p>
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

      <button type="button" className="btn btn-light" onClick={ () => props.socket.emit('newGame', {}) }>New Game</button>

    </div>
  );
}

export default Result;