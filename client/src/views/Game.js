import React, { useState, useEffect, useCallback } from 'react';
import debounce from "lodash/debounce";

import GameBadge from '../components/GameBadge';

import GameHeader from '../game_components/GameHeader';

import Lobby from '../game_views/Lobby';
import Teams from '../game_views/Teams';
import Roles from '../game_views/Roles';
import Board from '../game_views/Board';
import Result from '../game_views/Result';

import { getMePlayer, newPlayer } from '../models/player';
import BoardModel, { newBoard } from '../models/board';
import { newKey } from '../models/keycard';

import { 
  LOBBY,
  TEAMS,
  ROLES,
  BOARD,
  RESULT,
  CLASSIC,
  DUET,
} from '../utils/const';

function Game(props) {
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState(LOBBY);

  const [type, setType] = useState(undefined);
  const typeChecks = (type) => ({
    classic: () => (type === CLASSIC),
    duet: () => (type === DUET),
  });

  const [players, setPlayers] = useState([]);
  const [me, setMe] = useState(undefined);

  const [board, setBoard] = useState(new BoardModel());
  const [reveals, setReveals] = useState([]);
  const [key, setKey] = useState(undefined);
  const [turn, setTurn] = useState("");
  const [clue, setClue] = useState(undefined);
  const [guessesLeft, setGuessesLeft] = useState(undefined);
  const [score, setScore] = useState(undefined);
  const [winner, setWinner] = useState("");

  const debounceDisappear = () => setMessage("");
  const disappearCallback = useCallback(debounce(debounceDisappear, 5000), []);
  const setDisappearingMessage = useCallback((string, cssClass) => {
    setMessage({ string, class: cssClass });
    disappearCallback();
  }, [disappearCallback]);

  // on mount
  useEffect(() => {
    const reset = () => {
      setBoard(new BoardModel());
      setReveals([]);
      setKey(undefined);
      setTurn("");
      setClue(undefined);
      setScore(undefined);
      setWinner("");
    }

    // this will result in a 'players' message from server
    props.socket.emit('joinGame', { name: props.name, gameCode: props.gameCode });

    props.socket.on('type', data => {
      const { type } = data;
      setType(type);
    })

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
      setDisappearingMessage(data.message, 'alert-danger');
    });

    props.socket.on('turn', data => {
      const { turn } = data;
      setTurn(turn);
      setClue(undefined);
      setGuessesLeft(undefined);
    });

    props.socket.on('clue', data => {
      const { word, count } = data;
      setClue({ word, count });
    });

    props.socket.on('guesses', data => {
      const { guesses } = data;
      setGuessesLeft(guesses);
    });

    props.socket.on('score', data => {
      setScore(data);
    });

    props.socket.on('winner', data => {
      const { winner } = data;
      setWinner(winner);
    });

    props.socket.emit('getReconnect', {});

  }, [props.gameCode, props.name, props.socket, setDisappearingMessage]);

  useEffect(() => {
    props.socket.off('reveal');
    props.socket.on('reveal', data => {
      const newReveals = data.reveal;
      setReveals([...reveals, ...newReveals]);
    });
  }, [props.socket, reveals]);

  const game_views = {
    [LOBBY]: <Lobby 
              typeChecks={typeChecks(type)}
              socket={props.socket}
              players={players}
              me={me}/>,
    [TEAMS]: <Teams 
              socket={props.socket}
              players={players}/>,
    [ROLES]: <Roles
              socket={props.socket}
              players={players}
              me={me}/>,
    [BOARD]: <Board
              typeChecks={typeChecks(type)}
              socket={props.socket}
              players={players}
              me={me}
              board={board}
              reveals={reveals}
              keycard={key}
              turn={turn}
              clue={clue}
              guessesLeft={guessesLeft}/>,
    [RESULT]: <Result
              typeChecks={typeChecks(type)}
              socket={props.socket}
              me={me}
              winner={winner}
              board={board}
              reveals={reveals}
              keycard={key}/>,
  };

  return (
    <div>
      <GameBadge
        typeChecks={typeChecks(type)}
        gameCode={props.gameCode}
        copySuccess={() => setDisappearingMessage('Successfully copied shareable link!', 'alert-success')}/>

      {(phase === BOARD || phase === RESULT) &&
      <GameHeader
        typeChecks={typeChecks(type)}
        socket={props.socket}
        players={players}
        score={score}/>
      }

      {game_views[phase]}

      {(phase !== LOBBY && phase !== BOARD) &&
        <div>
          <br/>
          <button type="button" className="btn btn-light" onClick={ () => props.socket.emit('newGame', {}) }>Return to Lobby</button>
        </div>
      }

      {message && <div className={`alert ${message.class} message`} role="alert">
        {message.string}
      </div>}
    </div>
  );
}

export default Game;