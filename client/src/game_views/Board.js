import React from 'react';

import ClueInput from '../game_components/ClueInput';
import ClassicBoard from '../game_components/classic/ClassicBoard';
import DuetBoard from '../game_components/duet/DuetBoard';
import Hint from '../hint/Hint';

import { 
  RED,
  BLUE,
  isClassic,
  isDuet,
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
    const hintRight = team === BLUE;
    if (props.turn === team) {
      return (
        <div>
          {clueActive() &&
            <h6>{`${props.clue.word} : ${props.clue.count}`}<Hint right={hintRight} help="clue"/></h6>
          }
          {props.guessesLeft &&
            <h6>{`${props.guessesLeft} guesses left`}<Hint classic right={hintRight} help="guessesLeft"/></h6>
          }
        </div>
      );
    }
    return <div/>
  };

  const canSubmitClue = () => {
    if (isClassic(props.type)) {
      return myTurn() && props.me.isKey() && !clueActive();
    } else if (isDuet(props.type)) {
      return (myTurn() || firstTurn(props.turn)) && !clueActive();
    }
    return false;
  };

  const getTurnDescriptor = () => {
    if (isClassic(props.type)) {
      return classicTurnDescriptor(props.turn);
    } else if (isDuet(props.type)) {
      return duetTurnDescriptor(props.turn, clueActive());
    }
    return <div/>
  };

  const canEndTurn = () => {
    if (isClassic(props.type)) {
      return clueActive() && myTurn();
    } else if (isDuet(props.type)) {
      return clueActive() && !myTurn();
    }
    return false;
  };

  const renderBoard = () => {
    if (isClassic(props.type)) {
      return (
        <ClassicBoard
          revealWord={ (r, c) => props.socket.emit('revealWord', {r, c}) }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          isKey={props.me.isKey()}
          canReveal={myTurn() && !props.me.isKey() && clueActive()}/>
      );
    } else if (isDuet(props.type)) {
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
      <div>
        {getTurnDescriptor()}
      </div>
      <div className="row">
        <div className="col-5">
          {renderClue(RED)}
        </div>
        <div className="col-2">
          <br/>
          <br/>
        </div>
        <div className="col-5">
          {renderClue(BLUE)}
        </div>
      </div>

      {renderBoard()}
      <br/>

      {canSubmitClue() && <ClueInput socket={props.socket}/>}
      {canEndTurn() &&
        <button type="button" className="btn btn-light"
          onClick={ () => props.socket.emit('endTurn', {}) }>End turn</button>
      }
    </div>
  );
}

export default BoardView;