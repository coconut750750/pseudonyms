import React from 'react';

import ClueInput from '../game_components/ClueInput';
import Board from '../game_components/Board';

function BoardView(props) {
  const myTurn = () => {
    return props.me.team === props.turn;
  };

  const clueActive = () => {
    return props.clue !== undefined;
  };

  return (
    <div>
      <div className="row">
        <div className="col-4">
          {(clueActive() && props.turn === "red") &&
            <h6>{`${props.clue.word} : ${props.clue.count}`}</h6>
          }
        </div>
        <div className="col-4">
          <h6>{`${props.turn.replace(/^\w/, c => c.toUpperCase())} turn`}</h6>
          <button type="button" className="btn btn-light btn-sm"
            disabled={!clueActive() || !myTurn()}
            onClick={ () => props.socket.emit('endTurn', {}) }>End turn</button>
        </div>
        <div className="col-4">
          {(clueActive() && props.turn === "blue") &&
            <h6>{`${props.clue.word} : ${props.clue.count}`}</h6>
          }
        </div>
      </div>
      <br/>

      <Board
        players={props.players}
        revealWord={ (r, c) => props.socket.emit('revealWord', {r, c}) }
        board={props.board}
        reveals={props.reveals}
        keycard={props.keycard}
        isKey={props.me.isKey()}
        tilesActive={myTurn() && clueActive()}/>
      <br/>

      {(myTurn() && props.me.isKey() && !clueActive()) && 
        <ClueInput socket={props.socket}/>
      }
    </div>
  );
}

export default BoardView;