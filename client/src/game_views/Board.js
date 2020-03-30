import React from 'react';

import ClueInput from '../components/ClueInput';
import Board from '../components/Board';

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
          <h5>{props.turn === "red" ? "Red Turn" : "Blue Turn"}</h5>
        </div>
        <div className="col-4">
          {clueActive() &&
            <p>{`Clue: ${props.clue.clue}: ${props.clue.count}`}</p>
          }
        </div>
        <div className="col-4">
          {(myTurn() && clueActive())  &&
            <button type="button" className="btn btn-light" onClick={ () => props.socket.emit('endTurn', {}) }>End Turn</button>
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