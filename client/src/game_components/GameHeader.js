import React from 'react';

import PlayerList from '../components/PlayerList';
import SpectatorList from '../components/SpectatorList';
import Clock from '../game_components/Clock';
import Tip from '../components/Tip';
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

  const getSpectators = () => {
    return props.players.filter(p => p.noTeam());
  };

  const reds = <PlayerList players={getReds()}/>;
  const clock = <Clock socket={props.socket}/>;
  const blues = <PlayerList players={getBlues()}/>;

  const renderClassicHeader = () => (
    <div className="row">
      <div className="col-5">
        <h5>{`${props.score.red}`}<Tip classic help="score"/></h5>
      </div>
      <div className="col-2 p-0">{clock}</div>
      <div className="col-5">
        <h5>{`${props.score.blue}`}</h5>
      </div>
    </div>
  );

  const renderDuetHeader = () => (
    <div className="row">
      <div className="col-5">
        <h6>{`Words left: ${props.score.leftover}`}<Tip duet help="wordScore"/></h6>
      </div>
      <div className="col-2 p-0">{clock}</div>
      <div className="col-5">
        <h6>
          {`Turns: ${props.score.timer}`}<Tip duet right help="turnLimit"/>
          <br/>
          {`Mistakes: ${props.score.mistakes}`}<Tip duet right help="mistakeScore"/>
        </h6>
      </div>
    </div>
  );

  const renderHeader = () => {
    if (props.score === undefined) {
      return (
        <div className="row">
          <div className="col"><h5>Scoreboard loading...</h5></div>
        </div>
      );
    } else if (isClassic(props.mode)) {
      return renderClassicHeader();
    } else if (isDuet(props.mode)) {
      return renderDuetHeader();
    }
  };

  const renderPlayers = () => (
    <div className="row">
      <div className="col-5">
        {reds}
      </div>
      <div className="col-2 p-0"/>
      <div className="col-5">
        {blues}
      </div>
    </div>
  );

  const renderSpectators = () => {
    const spectators = getSpectators();
    if (spectators.length > 0) {
      return (
        <SpectatorList
          socket={props.socket}
          isAdmin={props.isAdmin}
          players={spectators}/>
      );
    } else {
      return <div/>;
    }
  };

  return (
    <div className="skinny">
      {renderSpectators()}
      {renderHeader()}
      {renderPlayers()}
    </div>
  );
}

export default GameHeader;