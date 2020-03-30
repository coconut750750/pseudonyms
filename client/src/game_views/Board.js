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
        <div className="col-4 turn">
          <h6>{`${props.turn} turn`}</h6>
        </div>
        <div className="col-4"/>
        <div className="col-4 clue">
          {clueActive() &&
            <h6>{`${props.clue.clue} ${props.clue.count}`}</h6>
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