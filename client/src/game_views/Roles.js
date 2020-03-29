import React, { useState } from 'react';

import PlayerList from '../components/PlayerList';

function Roles(props) {
  const [isKey, setIsKey] = useState(false);

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
      <h5>Select Keys</h5>

      <br/>
      
      <div className="row">
        <div className="col-4">
          <PlayerList players={getReds()}/>
          {props.me.isRed() &&
            <button type="button" className="btn btn-light"
              onClick={() => props.socket.emit('setKey', {})}>Elect</button>
          }
          <PlayerList players={getRedKey()}/>

        </div>

        <div className="col-4"></div>

        <div className="col-4">
          <PlayerList players={getBlues()}/>
          {props.me.isBlue() &&
            <button type="button" className="btn btn-light"
              onClick={() => props.socket.emit('setKey', {})}>Elect</button>
          }
          <PlayerList players={getBlueKey()}/>
        </div>
      </div>

      <br/>

      {confirmReady() &&
      <button type="button" className="btn btn-light"
        onClick={() => props.socket.emit('confirmRoles', {})}>Confirm Roles</button>
      }

    </div>
  );
}

export default Roles;