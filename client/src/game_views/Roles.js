import React from 'react';

import PlayerList from '../components/PlayerList';
import Tip from '../tip/Tip';

function Roles(props) {
  const getReds = () => {
    return props.players.filter(p => p.isRed());
  };

  const getRedCaptain = () => {
    return props.players.filter(p => (p.isRed() && p.isCaptain()));
  }

  const getBlues = () => {
    return props.players.filter(p => p.isBlue());
  };

  const getBlueCaptain = () => {
    return props.players.filter(p => (p.isBlue() && p.isCaptain()));
  }

  const confirmReady = () => {
    return getRedCaptain().length === 1 && getBlueCaptain().length === 1;
  };

  return (
    <div>
      <h5>Elect Captains<Tip classic right help="captainRole"/></h5>
      <h6>Each team must have one Captain</h6>
      <br/>
      
      <div className="row">
        <div className="col-4 p-0">
          {props.me.isRed() &&
            <button type="button" className="btn btn-light"
              onClick={() => props.socket.emit('setCaptain', {})}>Elect</button>
          }
        </div>
        <div className="col-4 p-0">
          <button type="button" className="btn btn-light"
            onClick={() => props.socket.emit('randomizeRoles', {})}>Randomize</button>
        </div>
        <div className="col-4 p-0">
          {props.me.isBlue() &&
            <button type="button" className="btn btn-light"
              onClick={() => props.socket.emit('setCaptain', {})}>Elect</button>
          }
        </div>
      </div>

      <div className="row">
        <div className="col-4 p-0"><PlayerList players={getReds()}/></div>
        <div className="col-4 p-0"/>
        <div className="col-4 p-0"><PlayerList players={getBlues()}/></div>
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