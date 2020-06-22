import React from 'react';

import PlayerList from '../components/PlayerList';
import Hint from '../hint/Hint';

function Roles(props) {
  const getReds = () => {
    return props.players.filter(p => p.isRed());
  };

  const getRedKey = () => {
    return props.players.filter(p => (p.isRed() && p.isKey()));
  }

  const getBlues = () => {
    return props.players.filter(p => p.isBlue());
  };

  const getBlueKey = () => {
    return props.players.filter(p => (p.isBlue() && p.isKey()));
  }

  const confirmReady = () => {
    return getRedKey().length === 1 && getBlueKey().length === 1;
  };

  return (
    <div>
      <h5>Elect Keys<Hint classic right help="keyRole"/></h5>
      <h6>Each team must have one key</h6>
      <br/>
      
      <div className="row">
        <div className="col-4">
          <PlayerList players={getReds()}/>
          {props.me.isRed() &&
            <button type="button" className="btn btn-light"
              onClick={() => props.socket.emit('setKey', {})}>Elect</button>
          }

        </div>

        <div className="col-4"></div>

        <div className="col-4">
          <PlayerList players={getBlues()}/>
          {props.me.isBlue() &&
            <button type="button" className="btn btn-light"
              onClick={() => props.socket.emit('setKey', {})}>Elect</button>
          }
        </div>
      </div>

      <br/>

      <button type="button" className="btn btn-light"
        disabled={!confirmReady()}
        onClick={() => props.socket.emit('confirmRoles', {})}>
        Confirm Roles
      </button>

    </div>
  );
}

export default Roles;