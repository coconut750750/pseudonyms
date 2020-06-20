import React from 'react';

import ClueInput from '../game_components/ClueInput';
import ClassicBoard from '../game_components/ClassicBoard';
import DuetBoard from '../game_components/DuetBoard';

const RED = "red";
const BLUE = "blue";
const otherTeam = (team) => {
  return team === RED ? BLUE : RED;
}

function BoardView(props) {
  const myTurn = () => {
    return props.me.team === props.turn;
  };

  const emptyTurn = () => {
    return props.turn === "";
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
      return (myTurn() || emptyTurn()) && !clueActive();
    }
    return false;
  };

  const getTurnDescriptor = () => {
    if (props.typeChecks.classic()) {
      return <h6>{`${props.turn.replace(/^\w/, c => c.toUpperCase())} turn`}</h6>;
    } else if (props.typeChecks.duet()) {
      if (emptyTurn()) {
        return <h6>First clue</h6>;
      }
      const teamName = props.turn.replace(/^\w/, c => c.toUpperCase());
      const otherTeamName = otherTeam(props.turn).replace(/^\w/, c => c.toUpperCase());
      if (!clueActive()) {
        return <h6>{`${teamName} giving clue`}</h6>;
      } else {
        return <h6>{`${otherTeamName} guessing`}</h6>;
      }
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
          players={props.players}
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
          players={props.players}
          revealWord={ (r, c) => props.socket.emit('revealWord', {r, c}) }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          isKey={true}
          canReveal={!myTurn() && clueActive()}/>
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