import React from 'react';

import ClassicBoard from '../game_components/classic/ClassicBoard';
import DuetBoard from '../game_components/duet/DuetBoard';
import Tip from '../components/Tip';
import Stats from '../game_components/Stats';

import {
  isClassic,
  isDuet,
  otherTeam,
} from '../utils/const';

function Result(props) {
  const renderBoard = () => {
    if (isClassic(props.mode)) {
      return (
        <ClassicBoard
          revealWord={ (r, c) => {} }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          showKey={true}/>
      );
    } else if (isDuet(props.mode)) {
      return (
        <DuetBoard
          revealWord={ (r, c) => {} }
          board={props.board}
          reveals={props.reveals}
          keycard={props.keycard}
          team={props.me.team}
          otherTeam={otherTeam(props.me.team)}/>
      );
    }
    return <div/>
  };

  const renderHeader = () => {
    if (isClassic(props.mode)) {
      return <h6 className="m-0">{`${props.winner.replace(/^\w/, c => c.toUpperCase())} wins!`}</h6>;
    } else if (isDuet(props.mode)) {
      return <h6 className="m-0">{props.winner ? "You win!" : "You lose"}</h6>;
    }
    return <div/>
  };

  return (
    <div>
      <h5 className="mb-0">Results<Tip classic={isClassic(props.mode)} duet={isDuet(props.mode)} help="resultsHelp"/></h5>
      {props.gameHeader}
      {renderHeader()}
      <p>
        Enjoyed playing?{' '}
        <a className="link" target="_blank" rel="noopener noreferrer" href="https://www.buymeacoffee.com/brandonwang">Support me</a>{' '}
        or <a className="link" target="_blank" rel="noopener noreferrer" href="/feedback">leave some feedback</a>!
      </p>
      <br/>

      {renderBoard()}
      <br/>

      <Stats
        mode={props.mode}
        stats={props.stats}
        clueHistory={props.clueHistory}
      />
    </div>
  );
}

export default Result;