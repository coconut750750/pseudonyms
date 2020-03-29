import React, { useState, useEffect } from 'react';

import GameCodeBadge from '../components/GameCodeBadge';

import Lobby from '../game_views/Lobby';
import Teams from '../game_views/Teams';
import Roles from '../game_views/Roles';
import Board from '../game_views/Board';
import Result from '../game_views/Result';

import { getMePlayer, newPlayer } from '../models/player';
import { newBoard, copyBoard } from '../models/board';
import { newKey } from '../models/keycard';

const LOBBY = "lobby";
const TEAMS = "teams";
const ROLES = "roles";
const BOARD = "board";
const RESULT = "result";

function Game(props) {
  const [phase, setPhase] = useState(LOBBY);
  const [players, setPlayers] = useState([]);
  const [me, setMe] = useState(undefined);
  const [message, setMessage] = useState("");
  const [board, setBoard] = useState(undefined);
  const [key, setKey] = useState(undefined);

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

    props.socket.on('board', data => {
      setBoard(newBoard(data.board));
    });

    props.socket.on('key', data => {
      console.log(data.keycard);
      setKey(newKey(data.keycard));
    });

    props.socket.on('message', data => {
      setMessage(data.message);
    });

    props.socket.on('start', data => {
      setMessage("");
      setPhase(TEAMS);
    });

  }, [props.gameCode, props.name, props.socket]);

  useEffect(() => {
    props.socket.off('reveal');
    props.socket.on('reveal', data => {
      const { r, c, color } = data;
      let b = copyBoard(board);
      b.reveal(r, c, color);
      setBoard(b);
    });
  }, [props.socket, board]);

  const game_views = {
    [LOBBY]: <Lobby 
              socket={props.socket}
              players={players}/>,
    [TEAMS]: <Teams 
              socket={props.socket}
              players={players}/>,
    [ROLES]: <Roles
              socket={props.socket}
              players={players}
              me={me}/>,
    [BOARD]: <Board
              socket={props.socket}
              players={players}
              me={me}
              board={board}
              keycard={key}/>,
    [RESULT]: <Result
              socket={props.socket}/>,
  };

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