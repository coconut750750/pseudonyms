import React, { useState, useEffect } from 'react';

import PlayerList from '../components/PlayerList';

import { getMePlayer, newPlayer } from '../models/player';

function Game(props) {
  const [players, setPlayers] = useState([]);


  // on mount
  useEffect(() => {
    props.socket.emit('join', { name: props.name, gameCode: props.gameCode });

    props.socket.on('players', data => {
      const players = data.players.map(p => newPlayer(p));
      const mePlayer = getMePlayer(players, props.name);
      setPlayers(players);
    });

  }, []);

  return (
    <div>
      <h5>Game</h5>
      <p>{props.gameCode}</p>
      <PlayerList players={players}/>
    </div>
  );
}

export default Game;