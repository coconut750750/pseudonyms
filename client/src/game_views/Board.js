import React from 'react';

import ClueInput from '../game_components/ClueInput';
import ClassicBoard from '../game_components/classic/ClassicBoard';
import DuetBoard from '../game_components/duet/DuetBoard';

import { 
  RED,
  BLUE,
  firstTurn,
  suddenDeath,
  classicTurnDescriptor,
  duetTurnDescriptor,
} from '../utils/const';

function BoardView(props) {
  const myTurn = () => {
    return props.me.team === props.turn;
  };

  const clueActive = () => {
    return props.clue !== undefined;
  };

  const renderClue = (team) => {
    if (props.turn === team) {
      return (
        <div>
          {clueActive() &&
            <h6>{`${props.clue.word} : ${props.clue.count}`}</h6>
          }
          {props.guessesLeft &&
            <h6>{`${props.guessesLeft} guesses left`}</h6>
          }
        </div>
      );
    }
    return <div/>
  };

  const canSubmitClue = () => {
    if (props.typeChecks.classic()) {
      return myTurn() && props.me.isKey() && !clueActive();
    } else if (props.typeChecks.duet()) {
      return (myTurn() || firstTurn(props.turn)) && !clueActive();
    }
    return false;
  };

  const getTurnDescriptor = () => {
    if (props.typeChecks.classic()) {
      return <h6>{classicTurnDescriptor(props.turn)}</h6>;
    } else if (props.typeChecks.duet()) {
      return <h6>{duetTurnDescriptor(props.turn, clueActive())}</h6>;
    }
    return <div/>
  };

  const canEndTurn = () => {
    if (props.typeChecks.classic()) {
      return clueActive() && myTurn();
    } else if (props.typeChecks.duet()) {
      return clueActive() && !myTurn();
    }
    return false;
  };

  const renderBoard = () => {
    if (props.typeChecks.classic()) {
      return (
        <ClassicBoard
          revealWord={ (r, c) => props.socket.emit('revealWord', {r, c}) }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          isKey={props.me.isKey()}
          canReveal={myTurn() && !props.me.isKey() && clueActive()}/>
      );
    } else if (props.typeChecks.duet()) {
      return (
        <DuetBoard
          revealWord={ (r, c) => props.socket.emit('revealWord', {r, c}) }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          team={props.me.team}
          isKey={true}
          canReveal={(!myTurn() && clueActive()) || suddenDeath(props.turn)}/>
      );
    }
    return <div/>
  };

  return (
    <div>
      <div className="row">
        <div className="col-4">
          {renderClue(RED)}
        </div>
        <div className="col-4">
          {getTurnDescriptor()}
          <button type="button" className="btn btn-light btn-sm"
            disabled={!canEndTurn()}
            onClick={ () => props.socket.emit('endTurn', {}) }>End turn</button>
        </div>
        <div className="col-4">
          {renderClue(BLUE)}
        </div>
      </div>
      <br/>

      {renderBoard()}
      <br/>

      {canSubmitClue() && 
        <ClueInput socket={props.socket}/>
      }
    </div>
  );
}

export default BoardView;