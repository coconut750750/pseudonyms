import React from 'react';

import ClassicBoard from '../game_components/ClassicBoard';
import DuetBoard from '../game_components/DuetBoard';

const RED = "red";
const BLUE = "blue";
const otherTeam = (team) => {
  return team === RED ? BLUE : RED;
}

function Result(props) {
  const renderBoard = () => {
    if (props.typeChecks.classic()) {
      return (
        <ClassicBoard
          revealWord={ (r, c) => {} }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          isKey={true}/>
      );
    } else if (props.typeChecks.duet()) {
      return (
        <DuetBoard
          revealWord={ (r, c) => {} }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          team={props.me.team}
          otherTeam={otherTeam(props.me.team)}
          isKey={true}/>
      );
    }
    return <div/>
  };

  const renderHeader = () => {
    if (props.typeChecks.classic()) {
      return <h6>{`${props.winner.replace(/^\w/, c => c.toUpperCase())} wins!`}</h6>;
    } else if (props.typeChecks.duet()) {
      return <h6>{props.winner ? "You win!" : "You lose"}</h6>;
    }
    return <div/>
  };

  return (
    <div>
      <h5>Results</h5>
      {renderHeader()}
      <br/>

      {renderBoard()}
      <br/>
    </div>
  );
}

export default Result;