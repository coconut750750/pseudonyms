import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useParams } from "react-router-dom";
import './App.css';

import io from 'socket.io-client';

import Home from './views/Home';
import Game from './views/Game';

import { checkCode } from './api/register';

const HOME = "home";
const GAME = "game";

function App(props) {
  const history = useHistory();
  const { urlgamecode } = useParams();

  const [viewState, setViewState] = useState(HOME);
  const [urlCode, setURLCode] = useState(undefined);
  const [gameData, setGameData] = useState({});

  const goHome = useCallback(() => {
    history.push('/');
    setViewState(HOME);
    setURLCode(undefined);
  }, [history]);

  const closeSocket = useCallback((socket) => {
    socket.emit('exitGame', {});
    socket.disconnect();
  }, []);

  const reset = useCallback((socket) => {
    closeSocket(socket);
    ReactDOM.unstable_batchedUpdates(() => {
      setGameData({});
      goHome();
    });
  }, [closeSocket, setGameData, goHome]);

  const setGame = useCallback((gameCode, name, gameMode) => {
    let socket = io();
    socket.on('end', data => {
      reset(socket);
    });
    socket.on('disconnect', data => {
      reset(socket);
    });

    ReactDOM.unstable_batchedUpdates(() => {
      setGameData({ gameCode, name, gameMode, socket });
      setViewState(GAME);
    });
    history.push(`/${gameCode}`);
  }, [reset, history]);

  useEffect(() => {
    if (viewState === HOME && urlgamecode !== undefined && urlgamecode.length !== 0) {
      checkCode(urlgamecode).then(resp => {
        setURLCode(urlgamecode);
      }).catch(resp => {  
        goHome();
      });
    }
  }, [viewState, goHome, urlgamecode, history]);

  const views = {
    [HOME]: <Home 
              urlCode={urlCode}
              setGame={setGame}/>,
    [GAME]: <Game
              socket={gameData.socket}
              gameCode={gameData.gameCode}
              name={gameData.name}
              gameMode={gameData.gameMode}
              exitGame={ () => closeSocket(gameData.socket) }/>,
    };

  return (
    <div className="App">
      {views[viewState]}
    </div>
  );
}

export default App;
