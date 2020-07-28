import React from 'react';

import Clue from '../game_components/Clue';
import Clues from '../game_components/Clues';
import ClueInput from '../game_components/ClueInput';
import ClassicBoard from '../game_components/classic/ClassicBoard';
import ClassicTurn from '../game_components/classic/Turn';
import DuetBoard from '../game_components/duet/DuetBoard';
import DuetTurn from '../game_components/duet/Turn';

import Tip from '../components/Tip';

import { 
  isClassic,
  isDuet,
  firstTurn,
  suddenDeath,
} from '../utils/const';

import './Board.css';

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

  const renderCurrentClue = () => {
    return (
      <div className="justify-content-center clue-container mb-1">
        {clueActive() &&
          <Clue
            clue={props.clue}
            tip={canReveal() && <Tip help="teamClue"/>}/>
        }
        {props.guessesLeft &&
          <h6 className="m-0"><small>{`${props.guessesLeft} guesses left`}</small>
            <Tip classic help="guessesLeft"/>
          </h6>
        }
      </div>
    );
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
      {renderCurrentClue()}

      <div className="row d-flex justify-content-center">
        <div className="col-xl"/>
        <div className="col-xl">
          {renderBoard()}
        </div>
        <div className="col-xl">
          <Clues clueHistory={props.clueHistory}/>
        </div>
      </div>

      {canSubmitClue() && 
        <ClueInput
          socket={props.socket}
          tip={<Tip right classic={isClassic(props.mode)} duet={isDuet(props.mode)} help="clueInput"/>}
        />
      }
      {canEndTurn() &&
        <div className="mt-2">
          <button type="button" className="btn"
            onClick={ () => props.socket.emit('endTurn', {}) }>End turn</button>
          <Tip right help="endTurn"/>
        </div>
      }
    </div>
  );
}

export default BoardView;