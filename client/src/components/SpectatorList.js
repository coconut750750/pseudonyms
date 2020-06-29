import React, { useState, useCallback } from 'react';

import PlayerList from './PlayerList';

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
          <button class="btn p-0 spectator-toggle" type="button" onClick={ () => setOpen(!open) }>
            <p>Spectators: {n}<span className={open ? "up" : "down"}/></p>
          </button>
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