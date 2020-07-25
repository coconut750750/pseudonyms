import React, { useState, useCallback } from 'react';

import PlayerList from './PlayerList';
import UpDownArrow from '../input_components/UpDownArrow';

import './SpectatorList.css';

export default function SpectatorList({ socket, players, isAdmin }) {
  const n = players.length;
  const [open, setOpen] = useState(false);

  const removePlayer = useCallback((player) => {
    socket.emit('removePlayer', { name: player.name });
  }, [socket]);

  if (n === 0) {
    return <div/>
  } else {
    return (
      <div className="spectator-list">
        <div className="row justify-content-center">
          <div class="p-0 spectator-toggle" onClick={ () => setOpen(!open) }>
            <p className="m-0">Spectators: {n}<UpDownArrow up={open}/></p>
          </div>
        </div>
        <div className={open ? "open" : "closed"}>
          <PlayerList
            players={players}
            remove={ isAdmin ? removePlayer : undefined }
            />
        </div>
      </div>
    );
  }

}