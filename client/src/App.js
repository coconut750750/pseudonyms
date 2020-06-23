import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import io from 'socket.io-client';

import Home from './views/Home';
import Create from './views/Create';
import Join from './views/Join';
import Game from './views/Game';
import Walkthrough from './views/Walkthrough';

import { checkCode } from './api/register';

const HOME = "home";
const WALKTHROUGH = "walkthrough";
const CREATE_CLASSIC = "create_classic";
const CREATE_DUET = "create_duet";
const JOIN = "join";
const GAME = "game";

function App() {
  const [viewState, setViewState] = useState(HOME);
  const [gameCode, setGameCode] = useState("");
  const [name, setName] = useState("");
  const [gameType, setGameType] = useState("");
  const [socket, setSocket] = useState(undefined);
  const [urlGameCode, setUrlGameCode] = useState(undefined);
  
  if (localStorage.getItem("tips") === null) {
    localStorage.setItem("tips", true);
  }

  const [tips, setTips] = useState(localStorage.getItem("tips") === 'true');
  const setTipsActive = (active) => {
    setTips(active);
    localStorage.setItem("tips", active);
  };

  const socketiohost = process.env.NODE_ENV === 'development' ? 'localhost:5000' : '';

  window.addEventListener("popstate", e => {
    window.location.href = '/';
  });

  const setGame = (gameCode, name, gameType) => {
    let socket = io(socketiohost);
    socket.on('end', data => {
      exitGame(socket);
    });
    socket.on('disconnect', data => {
      reset();
    });

    ReactDOM.unstable_batchedUpdates(() => {
      setSocket(socket);

      setGameCode(gameCode);
      setName(name);
      setGameType(gameType);
      setViewState(GAME);
    });
    window.history.pushState({}, 'Game', `/${gameCode}`);
  };

  const exitGame = (socket) => {
    closeSocket(socket);
    reset();
  };

  const reset = useCallback(() => {
    goHome();
    setGameCode("");
    setName("");
  }, []);

  const goHome = () => {
    window.history.pushState({}, 'Home', '/');
    setUrlGameCode(undefined);
    setViewState(HOME);
  };

  const closeSocket = (socket) => {
    socket.emit('exitGame', {});
    socket.disconnect();
    setSocket(undefined);
  };

  useEffect(() => {
    if (viewState === HOME && socket !== undefined) {
      closeSocket(socket);
    }
    if (viewState === HOME) {
      const url = new URL(window.location.href);
      const possibleGameCode = url.pathname.slice(1);
      if (possibleGameCode.length !== 0) {
        checkCode(possibleGameCode).then(resp => {
          if (resp.valid) {
            setUrlGameCode(possibleGameCode);
            setViewState(JOIN);
          } else {
            reset();
          }
        });
      } 
    }
  }, [viewState, socket, reset]);

  const views = {
    [HOME]:         <Home 
                      createClassicGame={ () => setViewState(CREATE_CLASSIC) } 
                      createDuetGame={ () => setViewState(CREATE_DUET) } 
                      joinGame={ () => setViewState(JOIN) }
                      viewWalkthrough={ () => setViewState(WALKTHROUGH) }/>,
    [WALKTHROUGH]:  <Walkthrough
                      goBack={ () => goHome() }/>,
    [CREATE_CLASSIC]: <Create
                        classic
                        goBack={ () => goHome() }
                        setGame={setGame}/>,
    [CREATE_DUET]:  <Create
                      duet
                      goBack={ () => goHome() }
                      setGame={setGame}/>,
    [JOIN]:         <Join
                      urlGameCode={urlGameCode}
                      goBack={ () => goHome() }
                      join={setGame}/>,
    [GAME]:         <Game
                      socket={socket}
                      gameCode={gameCode}
                      name={name}
                      gameType={gameType}
                      exitGame={ () => exitGame(socket) }/>,
    };

  return (
    <div className={`App ${tips ? '' : 'hidetips'}`}>
      <br/>
      <h3>Pseudonyms</h3>
      <div className="row">
        <div className="col-2"/>
        <div className="col-8">
          <h6>Codenames online</h6>
        </div>
        <div className="col-2">
          {viewState === GAME &&
            <div className="tip-toggle" onClick={() => setTipsActive(!tips)}>
              {tips 
              ? <img alt="" src="/lightbulb-on.svg"/>
              : <img alt="" src="/lightbulb-off.svg"/>
              }
            </div>
          }
        </div>
      </div>
      <hr/>

      {views[viewState]}
    </div>
  );
}

export default App;
