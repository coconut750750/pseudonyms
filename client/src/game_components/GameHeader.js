import React from 'react';

import PlayerList from '../components/PlayerList';
import Clock from '../game_components/Clock';
import Hint from '../hint/Hint';
import {
  isClassic,
  isDuet,
} from '../utils/const';

function GameHeader(props) {
  const getReds = () => {
    return props.players.filter(p => p.isRed());
  };

  const getBlues = () => {
    return props.players.filter(p => p.isBlue());
  };

  const renderClassicScore = () => (
    <div className="row">
      <div className="col-5">
        <h5>{`${props.score.red}`}<Hint classic help="score"/></h5>
      </div>
      <div className="col-2"></div>
      <div className="col-5">
        <h5>{`${props.score.blue}`}</h5>
      </div>
    </div>
  );

  const renderDuetScore = () => (
    <div className="row">
      <div className="col-5">
        <h6>
          {`Words: ${props.score.leftover}`}<Hint duet help="wordScore"/>
        </h6>
      </div>
      <div className="col-2"></div>
      <div className="col-5">
        <h6>
          {`Turns: ${props.score.timer}`}<Hint duet right help="turnLimit"/>
          <br/>
          {`Mistakes: ${props.score.mistakes}`}<Hint duet right help="mistakeScore"/>
        </h6>
      </div>
    </div>
  );

  const renderScore = () => {
    if (props.score === undefined) {
      return (
        <div className="row">
          <div className="col"><h5>Scoreboard loading...</h5></div>
        </div>
      );
    } else if (isClassic(props.type)) {
      return renderClassicScore();
    } else if (isDuet(props.type)) {
      return renderDuetScore();
    }
  }

  return (
    <div>
      {renderScore()}
      <div className="row">
        <div className="col-5"><PlayerList players={getReds()}/></div>
        <div className="col-2"><Clock socket={props.socket}/></div>
        <div className="col-5"><PlayerList players={getBlues()}/></div>
      </div>
    </div>
  );
}

export default GameHeader;