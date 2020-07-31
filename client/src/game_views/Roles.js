import React from 'react';

import PlayerList from '../components/PlayerList';
import Tip from '../components/Tip';

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
    <div className="fill-height mb-2 skinny">
      <h5>Elect Captains<Tip classic right help="captainRole"/></h5>
      <h6>Each team must have one Captain</h6>

      <div>
        <button type="button" className="btn"
          disabled={props.me.noTeam()}
          onClick={() => props.socket.emit('randomizeRoles', {})}>Randomize</button>
      </div>
      <br/>
      
      <div className="expand-height">
        <div className="row">
          <div className="col-4 p-0">
            {props.me.isRed() &&
              <button type="button" className="btn mb-2"
                onClick={() => props.socket.emit('setCaptain', {})}>Elect</button>
            }
          </div>
          <div className="col-4"/>
          <div className="col-4 p-0">
            {props.me.isBlue() &&
              <button type="button" className="btn mb-2"
                onClick={() => props.socket.emit('setCaptain', {})}>Elect</button>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-4 p-0"><PlayerList vertical players={getReds()}/></div>
          <div className="col-4 p-0"/>
          <div className="col-4 p-0"><PlayerList vertical players={getBlues()}/></div>
        </div>
      </div>

      <div>
        <button type="button" className="btn"
          disabled={!confirmReady()}
          onClick={() => props.socket.emit('confirmRoles', {})}>
          Confirm Roles
        </button>
      </div>
    </div>
  );
}

export default Roles;