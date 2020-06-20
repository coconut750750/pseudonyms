import React from 'react';

import PlayerList from '../components/PlayerList';
import Clock from '../game_components/Clock';

function GameHeader(props) {
  const getReds = () => {
    return props.players.filter(p => p.isRed());
  };

  const getBlues = () => {
    return props.players.filter(p => p.isBlue());
  };

  const renderClassicScore = () => (
    <div className="row">
      <div className="col-4"><h5>{`${props.score.red}`}</h5></div>
      <div className="col-4"></div>
      <div className="col-4"><h5>{`${props.score.blue}`}</h5></div>
    </div>
  );

  const renderDuetScore = () => (
    <div className="row">
      <div className="col-4"><h6>{`Words left: ${props.score.leftover}`}</h6></div>
      <div className="col-4"></div>
      <div className="col-4"><h6>{`Time left: ${props.score.timer}`}</h6></div>
    </div>
  );

  const renderScore = () => {
    if (props.score === undefined) {
      return (
        <div className="row">
          <div className="col"><h5>Scoreboard loading...</h5></div>
        </div>
      );
    } else if (props.typeChecks.classic()) {
      return renderClassicScore();
    } else if (props.typeChecks.duet()) {
      return renderDuetScore();
    }
  }

  return (
    <div>
      {renderScore()}
      <div className="row">
        <div className="col-4"><PlayerList players={getReds()}/></div>
        <div className="col-4"><Clock socket={props.socket}/></div>
        <div className="col-4"><PlayerList players={getBlues()}/></div>
      </div>
    </div>
  );
}

export default GameHeader;