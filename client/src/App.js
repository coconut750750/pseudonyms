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
  
  const [gameInfo, setGameInfo] = useState({});
  const [socket, setSocket] = useState(undefined);
  
  if (localStorage.getItem("tips") === null) {
    localStorage.setItem("tips", true);
  }

  const [tips, setTips] = useState(localStorage.getItem("tips") === 'true');
  const setTipsActive = (active) => {
    setTips(active);
    localStorage.setItem("tips", active);
  };

  const exitGame = (socket) => {
    closeSocket(socket);
    reset();
  };

  const setGame = (gameCode, name, gameMode) => {
    const socketiohost = process.env.NODE_ENV === 'development' ? 'localhost:5000' : '';
    let socket = io(socketiohost);
    socket.on('end', data => {
      exitGame(socket);
    });
    socket.on('disconnect', data => {
      reset();
    });

    ReactDOM.unstable_batchedUpdates(() => {
      setSocket(socket);
      setGameInfo({ gameCode, name, gameMode });
      setViewState(GAME);
    });
    history.push(`/${gameCode}`);
  };

  const goHome = useCallback(() => {
    history.push('/');
    setViewState(HOME);
  }, [history]);

  const reset = useCallback(() => {
    goHome();
    setGameInfo({});
  }, [goHome]);

  const closeSocket = (socket) => {
    socket.emit('exitGame', {});
    socket.disconnect();
    setSocket(undefined);
  };

  useEffect(() => {
    if (viewState === HOME && socket !== undefined) {
      closeSocket(socket);
    }
    if (viewState === HOME && urlgamecode !== undefined) {
      if (urlgamecode.length !== 0) {
        checkCode(urlgamecode).then(resp => {
          setViewState(JOIN);
        }).catch(resp => {  
          reset();
        });
      } 
    }
  }, [viewState, socket, reset, props]);

  const views = {
    [HOME]:         <Home 
                      createClassicGame={ () => setViewState(CREATE_CLASSIC) } 
                      createDuetGame={ () => setViewState(CREATE_DUET) } 
                      joinGame={ () => setViewState(JOIN) }/>,
    [CREATE_CLASSIC]: <Create
                        classic
                        goBack={ () => goHome() }
                        setGame={setGame}/>,
    [CREATE_DUET]:  <Create
                      duet
                      goBack={ () => goHome() }
                      setGame={setGame}/>,
    [JOIN]:         <Join
                      urlGameCode={urlgamecode}
                      goBack={ () => goHome() }
                      join={setGame}/>,
    [GAME]:         <Game
                      socket={socket}
                      gameCode={gameInfo.gameCode}
                      name={gameInfo.name}
                      gameMode={gameInfo.gameMode}
                      exitGame={ () => exitGame(socket) }/>,
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
