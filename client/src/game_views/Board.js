import React from 'react';

import ClueInput from '../game_components/ClueInput';
import ClassicBoard from '../game_components/classic/ClassicBoard';
import ClassicTurn from '../game_components/classic/Turn';
import DuetBoard from '../game_components/duet/DuetBoard';
import DuetTurn from '../game_components/duet/Turn';

import Tip from '../tip/Tip';

import { 
  RED,
  BLUE,
  isClassic,
  isDuet,
  firstTurn,
  suddenDeath,
} from '../utils/const';

function BoardView(props) {
  const assignedTeam = () => {
    return !props.me.noTeam();
  };

  const myTurn = () => {
    return props.me.team === props.turn;
  };

  const clueActive = () => {
    return props.clue !== undefined;
  };

  const canReveal = () => {
    if (assignedTeam()) {
      if (isClassic(props.mode)) {
        return myTurn() && !props.me.isCaptain() && clueActive();
      } else if (isDuet(props.mode)) {
        return (!myTurn() && clueActive()) || suddenDeath(props.turn);
      }
    }
    return false;
  };

  const canEndTurn = () => {
    if (assignedTeam()) {
      if (isClassic(props.mode)) {
        return canReveal();
      } else if (isDuet(props.mode)) {
        return !myTurn() && clueActive();
      }
    }
    return false;
  };

  const canSubmitClue = () => {
    if (assignedTeam()) {
      if (isClassic(props.mode)) {
        return myTurn() && props.me.isCaptain() && !clueActive();
      } else if (isDuet(props.mode)) {
        return (myTurn() || firstTurn(props.turn)) && !clueActive();
      }
    }
    return false;
  };

  const getTurnDescriptor = () => {
    if (isClassic(props.mode)) {
      return <ClassicTurn turn={props.turn}/>;
    } else if (isDuet(props.mode)) {
      return <DuetTurn turn={props.turn} clueActive={clueActive()}/>;
    }
    return <div/>
  };

  const renderClue = (team) => {
    const tipRight = team === BLUE;
    if (props.turn === team) {
      return (
        <div>
          {clueActive() &&
            <h6 className="m-0">{`${props.clue.word} : ${props.clue.count}`}
              {canReveal() && <Tip right={tipRight} help="teamClue"/>}
            </h6>
          }
          {props.guessesLeft &&
            <h6 className="m-0"><small>{`${props.guessesLeft} guesses left`}</small>
              <Tip classic right={tipRight} help="guessesLeft"/>
            </h6>
          }
        </div>
      );
    }
    return <div/>
  };

  const renderBoard = () => {
    if (isClassic(props.mode)) {
      return (
        <ClassicBoard
          revealWord={ (r, c) => props.socket.emit('revealWord', {r, c}) }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          showKey={props.me.isCaptain()}
          canReveal={canReveal()}/>
      );
    } else if (isDuet(props.mode)) {
      return (
        <DuetBoard
          revealWord={ (r, c) => props.socket.emit('revealWord', {r, c}) }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          team={props.me.team}
          canReveal={canReveal()}/>
      );
    }
    return <div/>
  };

  return (
    <div>
      {getTurnDescriptor()}
      {props.gameHeader}
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

      {canSubmitClue() && 
        <ClueInput
          socket={props.socket}
          tip={<Tip right classic={isClassic(props.mode)} duet={isDuet(props.mode)} help="clueInput"/>}
        />
      }
      {canEndTurn() &&
        <div>
          <button type="button" className="btn btn-light"
            onClick={ () => props.socket.emit('endTurn', {}) }>End turn</button>
          <Tip right help="endTurn"/>
        </div>
      }
    </div>
  );
}

export default BoardView;