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

  const renderClueAndButton = (team) => {
    if (clueActive() && props.turn === team) {
      return (
        <div>
          <h6>{`${props.clue.word} : ${props.clue.count}`}</h6>
          <h6>{`${props.guessesLeft} guesses left`}</h6>
        </div>
      );
    } else {
      return <div/>
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-4">
          {renderClueAndButton("red")}
        </div>
        <div className="col-4">
          <h6>{`${props.turn.replace(/^\w/, c => c.toUpperCase())} turn`}</h6>
          <button type="button" className="btn btn-light btn-sm"
            disabled={!clueActive() || !myTurn()}
            onClick={ () => props.socket.emit('endTurn', {}) }>End turn</button>
        </div>
        <div className="col-4">
          {renderClueAndButton("blue")}
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