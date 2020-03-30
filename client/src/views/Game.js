import React, { useState, useEffect } from 'react';

import GameCodeBadge from '../components/GameCodeBadge';
import GameHeader from '../components/GameHeader';

import Lobby from '../game_views/Lobby';
import Teams from '../game_views/Teams';
import Roles from '../game_views/Roles';
import Board from '../game_views/Board';
import Result from '../game_views/Result';

import { getMePlayer, newPlayer } from '../models/player';
import { newBoard } from '../models/board';
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
  const [reveals, setReveals] = useState([]);
  const [key, setKey] = useState(undefined);
  const [turn, setTurn] = useState(0);
  const [clue, setClue] = useState(undefined);
  const [score, setScore] = useState(undefined);
  const [winner, setWinner] = useState(undefined);

  const reset = () => {
    setPlayers([]);
    setMe(undefined);
    setMessage("");

    setBoard(undefined);
    setReveals([]);
    setKey(undefined);
    setTurn(0);
    setClue(undefined);
    setWinner(undefined);
  };

  // on mount
  useEffect(() => {
    // this will result in a 'players' message from server
    props.socket.emit('join', { name: props.name, gameCode: props.gameCode });

    props.socket.on('phase', data => {
      setPhase(data.phase);
      if (data.phase === LOBBY) {
        reset();
      }
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
      setKey(newKey(data.keycard));
    });

    props.socket.on('message', data => {
      setMessage(data.message);
    });

    props.socket.on('turn', data => {
      const { turn } = data;
      setTurn(turn);
      setClue(undefined);
    });

    props.socket.on('clue', data => {
      const { clue, count } = data;
      setClue({ clue, count });
    });

    props.socket.on('score', data => {
      const { red, blue } = data;
      setScore({ red, blue });
    });

    props.socket.on('winner', data => {
      const { winner } = data;
      setWinner(winner);
    });

    // get data if disconnected
    props.socket.emit('getBoard', {});
    props.socket.emit('getKey', {});
    props.socket.emit('getTurn', {});
    props.socket.emit('getClue', {});
    props.socket.emit('getWinner', {});
    props.socket.emit('getPhase', {});

  }, [props.gameCode, props.name, props.socket]);

  useEffect(() => {
    props.socket.off('reveal');
    props.socket.on('reveal', data => {
      const newReveals = data.reveal;
      setReveals([...reveals, ...newReveals]);
    });
  }, [props.socket, reveals]);

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
              reveals={reveals}
              keycard={key}
              turn={turn}
              clue={clue}/>,
    [RESULT]: <Result
              socket={props.socket}
              players={players}
              winner={winner}
              board={board}
              reveals={reveals}
              keycard={key}/>,
  };

  return (
    <div>
      <GameCodeBadge gameCode={props.gameCode}/>
      <br/>

      {(phase === BOARD || phase === RESULT) &&
      <GameHeader
        players={players}
        score={score}/>
      }

      {game_views[phase]}

      <br/>
      {message && <div class="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  );
}

export default Game;