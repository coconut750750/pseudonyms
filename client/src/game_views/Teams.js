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
    <div className="fill-height mb-2 skinny">
      <h5>Select Teams</h5>
      <h6>Everyone must be on a team</h6>

      <div className="">
        <div className="p-0 m-2">
          <button type="button" className="btn"
            onClick={() => props.socket.emit('randomizeTeams', {})}>Randomize</button>
        </div>
        <div className="p-0"><PlayerList players={getUndecideds()}/></div>
      </div>
      <br/>

      <div className="row expand-height">
        <div className="col-4 p-0">
          <button type="button" className="btn"
            onClick={() => props.socket.emit('selectTeam', { team: 'red' })}>Join Red</button>
          <PlayerList vertical players={getReds()}/>
        </div>
        <div className="col-4"><br/></div>
        <div className="col-4 p-0">
          <button type="button" className="btn"
            onClick={() => props.socket.emit('selectTeam', { team: 'blue' })}>Join Blue</button>
          <PlayerList vertical players={getBlues()}/>
        </div>
      </div>
      
      <br/>

      <div>
        <button type="button" className="btn"
          disabled={!confirmReady()}
          onClick={() => props.socket.emit('confirmTeams', {})}>
          Confirm Teams
        </button>
      </div>
    </div>
  );
}

export default Teams;