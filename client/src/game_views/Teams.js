import React from 'react';

import PlayerList from '../components/PlayerList';

function Teams(props) {
  const getReds = () => {
    return props.players.filter(p => p.isRed());
  };

  const getBlues = () => {
    return props.players.filter(p => p.isBlue());
  };

  const getUndecideds = () => {
    return props.players.filter(p => p.noTeam());
  }

  const confirmReady = () => {
    return getUndecideds().length === 0 && getReds().length >= 2 && getBlues().length >= 2;
  };

  return (
    <div>
      <h5>Select Teams</h5>
      <p>Each team must have two players</p>

      <br/>
      
      <div className="row">
        <div className="col-4">
          <button type="button" className="btn btn-light"
            onClick={() => props.socket.emit('selectTeam', { team: 'red' })}>Join Red</button>
          <PlayerList players={getReds()}/>
        </div>

        <div className="col-4">
          <PlayerList players={getUndecideds()}/>
        </div>

        <div className="col-4">
          <button type="button" className="btn btn-light"
            onClick={() => props.socket.emit('selectTeam', { team: 'blue' })}>Join Blue</button>
          <PlayerList players={getBlues()}/>
        </div>
      </div>

      <br/>

      {confirmReady() &&
      <button type="button" className="btn btn-light"
        onClick={() => props.socket.emit('confirmTeams', {})}>Confirm Teams</button>
      }

    </div>
  );
}

export default Teams;