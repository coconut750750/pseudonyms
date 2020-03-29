import React, { useState, useEffect } from 'react';

import PlayerList from '../components/PlayerList';
import GameCodeBadge from '../components/GameCodeBadge';

import { getMePlayer, newPlayer } from '../models/player';

function Game(props) {
  const [phase, setPhase] = useState([]);
  const [players, setPlayers] = useState([]);
  const [me, setMe] = useState(undefined);
  const [message, setMessage] = useState("");

  // on mount
  useEffect(() => {
    props.socket.emit('join', { name: props.name, gameCode: props.gameCode });

    props.socket.on('players', data => {
      const players = data.players.map(p => newPlayer(p));
      const mePlayer = getMePlayer(players, props.name);
      setPlayers(players);
      setMe(mePlayer)
    });

    props.socket.on('message', data => {
      setMessage(data.message);
    });

    props.socket.on('start', data => {
      alert('started!');
    });

  }, [props.gameCode, props.name, props.socket]);

  return (
    <div>
      <h5>Game</h5>
      <GameCodeBadge gameCode={props.gameCode}/>
      <PlayerList players={players}/>

      <br/>

      <button type="button" className="btn btn-light" onClick={ () => props.socket.emit('startGame', {}) }>Start Game</button>

      {message && <div class="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  );
}

export default Game;