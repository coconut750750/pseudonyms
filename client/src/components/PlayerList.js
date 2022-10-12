import React from 'react';

import PlayerBadge from './PlayerBadge';

import './PlayerList.css';

function PlayerList(props) {
  return (
    <div className={`player-list d-flex justify-content-center ${props.vertical ? "vertical" : "horizontal"}`} style={{ flexWrap: "wrap" }}>
      {props.players.map( player => 
        <div
          key={player.name}
        >
          <PlayerBadge
            key={player.name}
            player={player}
            remove={props.removeExempt === player ? undefined : props.remove}/>
        </div>
      )}
    </div>
  );
}

export default PlayerList;
