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
    return getUndecideds().length === 0;
  };

  return (
    <div>
      <h5>Select Teams</h5>
      <h6>Each team must have at least two players</h6>
      <br/>

      <div className="row">
        <div className="col-4 p-0">
          <button type="button" className="btn btn-light"
            onClick={() => props.socket.emit('selectTeam', { team: 'red' })}>Join Red</button>
        </div>
        <div className="col-4 p-0">
          <button type="button" className="btn btn-light"
            onClick={() => props.socket.emit('randomizeTeams', {})}>Randomize</button>
        </div>
        <div className="col-4 p-0">
          <button type="button" className="btn btn-light"
            onClick={() => props.socket.emit('selectTeam', { team: 'blue' })}>Join Blue</button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-4 p-0"><PlayerList players={getReds()}/></div>
        <div className="col-4 p-0"><PlayerList players={getUndecideds()}/></div>
        <div className="col-4 p-0"><PlayerList players={getBlues()}/></div>
      </div>

      <br/>

      <button type="button" className="btn btn-light"
        disabled={!confirmReady()}
        onClick={() => props.socket.emit('confirmTeams', {})}>
        Confirm Teams
      </button>

    </div>
  );
}

export default Teams;