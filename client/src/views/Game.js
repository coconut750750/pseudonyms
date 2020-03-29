import React, { useState, useEffect } from 'react';

import PlayerList from '../components/PlayerList';
import GameCodeBadge from '../components/GameCodeBadge';

import Lobby from '../game_views/Lobby';
import Teams from '../game_views/Teams';
import Roles from '../game_views/Roles';

import { getMePlayer, newPlayer } from '../models/player';

const LOBBY = "lobby";
const TEAMS = "teams";
const ROLES = "roles";

function Game(props) {
  const [phase, setPhase] = useState(LOBBY);
  const [players, setPlayers] = useState([]);
  const [me, setMe] = useState(undefined);
  const [message, setMessage] = useState("");

  // on mount
  useEffect(() => {
    // this will result in a 'players' message from server
    props.socket.emit('join', { name: props.name, gameCode: props.gameCode });

    props.socket.on('phase', data => {
      setPhase(data.phase);
    });

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
      setMessage("");
      setPhase(TEAMS);
    });

  }, [props.gameCode, props.name, props.socket]);

  const game_views = {
    [LOBBY]: <Lobby 
              socket={props.socket}
              players={players}/>,
    [TEAMS]: <Teams 
              socket={props.socket}
              players={players}
              confirmTeams={() => setPhase(ROLES)}/>,
    [ROLES]: <Roles
              socket={props.socket}
              players={players}
              me={me}
              confirmRoles={() => {}}/>,

  }

  return (
    <div>
      <h5>Game</h5>
      <GameCodeBadge gameCode={props.gameCode}/>
      <br/>

      {game_views[phase]}

      {message && <div class="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  );
}

export default Game;