import React from 'react';

import ClassicBoard from '../game_components/classic/ClassicBoard';
import DuetBoard from '../game_components/duet/DuetBoard';
import Tip from '../tip/Tip';

import {
  isClassic,
  isDuet,
  otherTeam,
} from '../utils/const';

function Result(props) {
  const renderBoard = () => {
    if (isClassic(props.type)) {
      return (
        <ClassicBoard
          revealWord={ (r, c) => {} }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          isKey={true}/>
      );
    } else if (isDuet(props.type)) {
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
    if (isClassic(props.type)) {
      return <h6>{`${props.winner.replace(/^\w/, c => c.toUpperCase())} wins!`}</h6>;
    } else if (isDuet(props.type)) {
      return <h6>{props.winner ? "You win!" : "You lose"}</h6>;
    }
    return <div/>
  };

  return (
    <div>
      <h5>Results<Tip classic={isClassic(props.type)} duet={isDuet(props.type)} help="resultsHelp"/></h5>
      {renderHeader()}
      <br/>

      {renderBoard()}
    </div>
  );
}

export default Result;