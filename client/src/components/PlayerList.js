import React from 'react';

import PlayerBadge from './PlayerBadge';

function PlayerList(props) {
  return (
    <div className="d-flex justify-content-center">
      {props.players.map( player => <PlayerBadge key={player.name} player={player}/> )}
    </div>
  );
}

export default PlayerList;