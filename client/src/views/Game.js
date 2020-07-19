import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

import GameBadge from '../components/GameBadge';
import WrappedMessage from '../components/WrappedMessage';

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
} from '../utils/const';

function Game({ socket, gameCode, name, gameMode, exitGame, setError, setSuccess }) {
  const [phase, setPhase] = useState(undefined);

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

  const [tips, setTips] = useState((localStorage.getItem("tips") || 'true') === 'true');
  const setTipsActive = useCallback((active) => {
    setTips(active);
    localStorage.setItem("tips", active);
  }, []);

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

    socket.emit('joinGame', { name: name, gameCode: gameCode });

    socket.off('phase');
    socket.on('phase', data => {
      ReactDOM.unstable_batchedUpdates(() => {
        setPhase(data.phase);
        if (data.phase === LOBBY) {
          reset();
        }
      });
    });

    socket.off('players');
    socket.on('players', data => {
      ReactDOM.unstable_batchedUpdates(() => {
        const players = data.players.map(p => newPlayer(p));
        const mePlayer = getMePlayer(players, name);
        setPlayers(players);
        setMe(mePlayer)
      });
    });

    socket.off('board');
    socket.on('board', data => {
      setBoard(newBoard(data.board));
    });

    socket.off('key');
    socket.on('key', data => {
      setKey(newKey(data.keycard));
    });

    socket.off('message');
    socket.on('message', data => {
      setError(data.message);
    });

    socket.off('turn');
    socket.on('turn', data => {
      const { turn } = data;
      ReactDOM.unstable_batchedUpdates(() => {
        setTurn(turn);
        setClue(undefined);
        setGuessesLeft(undefined);
      });
    });

    socket.off('clue');
    socket.on('clue', data => {
      const { word, count } = data;
      setClue({ word, count });
    });

    socket.off('guesses');
    socket.on('guesses', data => {
      const { guesses } = data;
      setGuessesLeft(guesses);
    });

    socket.off('score');
    socket.on('score', data => {
      setScore(data);
    });

    socket.off('winner');
    socket.on('winner', data => {
      const { winner } = data;
      setWinner(winner);
    });

    socket.emit('getReconnect', {});

  }, [gameCode, name, socket, setError]);

  useEffect(() => {
    socket.off('reveal');
    socket.on('reveal', data => {
      const newReveals = data.reveal;
      setReveals([...reveals, ...newReveals]);
    });
  }, [socket, reveals]);

  const gameHeader = (
    <GameHeader
      mode={gameMode}
      socket={socket}
      isAdmin={me?.isAdmin}
      players={players}
      score={score}/>
  );

  const game_views = {
    [LOBBY]: <Lobby 
              mode={gameMode}
              socket={socket}
              players={players}
              me={me}/>,
    [TEAMS]: <Teams 
              socket={socket}
              players={players}/>,
    [ROLES]: <Roles
              socket={socket}
              players={players}
              me={me}/>,
    [BOARD]: <Board
              mode={gameMode}
              socket={socket}
              gameHeader={gameHeader}
              me={me}
              board={board}
              reveals={reveals}
              keycard={key}
              turn={turn}
              clue={clue}
              guessesLeft={guessesLeft}/>,
    [RESULT]: <Result
              mode={gameMode}
              socket={socket}
              gameHeader={gameHeader}
              me={me}
              winner={winner}
              board={board}
              reveals={reveals}
              keycard={key}/>,
  };

  return (
    <div id="game-view" className={`fill-height ${tips ? '' : 'hidetips'} mb-2`}>
      <GameBadge
        mode={gameMode}
        gameCode={gameCode}
        tips={tips}
        setTipsActive={setTipsActive}
        copySuccess={() => setSuccess('Successfully copied shareable link!')}/>

      {game_views[phase]}

      {(phase !== LOBBY && phase !== BOARD) &&
        <div>
          <button type="button" className="btn" onClick={ () => socket.emit('newGame', {}) }>Return to Lobby</button>
        </div>
      }
    </div>
  );
}

export default WrappedMessage(Game);