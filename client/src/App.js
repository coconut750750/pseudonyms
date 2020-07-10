import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useParams } from "react-router-dom";
import './App.css';

import io from 'socket.io-client';

import Header from './components/Header';

import Home from './views/Home';
import Create from './views/Create';
import Join from './views/Join';
import Game from './views/Game';

import { checkCode } from './api/register';

const HOME = "home";
const CREATE_CLASSIC = "create_classic";
const CREATE_DUET = "create_duet";
const JOIN = "join";
const GAME = "game";

function App(props) {
  const history = useHistory();
  const { urlgamecode } = useParams();

  const [viewState, setViewState] = useState(HOME);
  const [gameData, setGameData] = useState({});

  const [tips, setTips] = useState((localStorage.getItem("tips") || 'true') === 'true');
  const setTipsActive = useCallback((active) => {
    setTips(active);
    localStorage.setItem("tips", active);
  }, []);

  const goHome = useCallback(() => {
    history.push('/');
    setViewState(HOME);
  }, [history]);

  const closeSocket = useCallback((socket) => {
    socket.emit('exitGame', {});
    socket.disconnect();
  }, []);

  const setGame = useCallback((gameCode, name, gameMode) => {
    const socketiohost = process.env.NODE_ENV === 'development' ? 'localhost:5000' : '';
    let socket = io(socketiohost);
    socket.on('end', data => {
      closeSocket(socket);
    });
    socket.on('disconnect', data => {
      ReactDOM.unstable_batchedUpdates(() => {
        setGameData({});
        goHome();
      });
    });

    ReactDOM.unstable_batchedUpdates(() => {
      setGameData({ gameCode, name, gameMode, socket });
      setViewState(GAME);
    });
    history.push(`/${gameCode}`);
  }, [closeSocket, goHome, history]);

  useEffect(() => {
    if (viewState === HOME && urlgamecode !== undefined && urlgamecode.length !== 0) {
      checkCode(urlgamecode).then(resp => {
        setViewState(JOIN);
      }).catch(resp => {  
        goHome();
      });
    }
  }, [viewState, goHome, urlgamecode]);

  const views = {
    [HOME]:         <Home 
                      createClassicGame={ () => setViewState(CREATE_CLASSIC) } 
                      createDuetGame={ () => setViewState(CREATE_DUET) } 
                      joinGame={ () => setViewState(JOIN) }/>,
    [CREATE_CLASSIC]: <Create
                        classic
                        goBack={goHome}
                        setGame={setGame}/>,
    [CREATE_DUET]:  <Create
                      duet
                      goBack={goHome}
                      setGame={setGame}/>,
    [JOIN]:         <Join
                      urlGameCode={urlgamecode}
                      goBack={goHome}
                      join={setGame}/>,
    [GAME]:         <Game
                      socket={gameData.socket}
                      gameCode={gameData.gameCode}
                      name={gameData.name}
                      gameMode={gameData.gameMode}
                      exitGame={ () => closeSocket(gameData.socket) }/>,
    };

  return (
    <div className={`App ${tips ? '' : 'hidetips'}`}>
      <Header
        tipToggle={
          viewState === GAME &&
            <div className="tip-toggle" onClick={() => setTipsActive(!tips)}>
              {tips 
              ? <img alt="" src="/lightbulb-on.svg"/>
              : <img alt="" src="/lightbulb-off.svg"/>
              }
            </div>
        }
      />

      {views[viewState]}
    </div>
  );
}

export default App;
