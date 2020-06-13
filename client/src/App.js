import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

import io from 'socket.io-client';

import Home from './views/Home';
import HowTo from './views/HowTo';
import Create from './views/Create';
import Join from './views/Join';
import Game from './views/Game';
import Walkthrough from './views/Walkthrough';
import MoreGames from './views/MoreGames';

import Footer from './components/Footer';

import { checkCode } from './api/register';

const HOME = "home";
const HOWTO = "howto";
const WALKTHROUGH = "walkthrough";
const MORE = "more";
const CREATE = "create";
const JOIN = "join";
const GAME = "game";

function App() {
  const [viewState, setViewState] = useState(HOME);
  const [gameCode, setGameCode] = useState("");
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(undefined);
  const [urlGameCode, setUrlGameCode] = useState(undefined);

  const socketiohost = process.env.NODE_ENV === 'development' ? 'localhost:5000' : '';

  window.addEventListener("popstate", e => {
    window.location.href = '/';
  });

  const setGame = (gameCode, name) => {
    let socket = io(socketiohost);
    socket.on('end', data => {
      exitGame(socket);
    });
    socket.on('disconnect', data => {
      reset();
    });
    setSocket(socket);

    setGameCode(gameCode);
    setName(name);
    setViewState(GAME);
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
                      createGame={ () => setViewState(CREATE) } 
                      joinGame={ () => setViewState(JOIN) }
                      viewHowTo={ () => setViewState(HOWTO) }
                      viewWalkthrough={ () => setViewState(WALKTHROUGH) }
                      viewMoreGames={ () => setViewState(MORE) }/>,
    [WALKTHROUGH]:  <Walkthrough
                      goBack={ () => goHome() }/>,
    [HOWTO]:        <HowTo
                      goBack={ () => goHome() }/>,
    [MORE]:         <MoreGames
                      goBack={ () => goHome() }/>,
    [CREATE]:       <Create
                      goBack={ () => goHome() }
                      setGame={ (gameCode, name) => setGame(gameCode, name) }/>,
    [JOIN]:         <Join
                      urlGameCode={urlGameCode}
                      goBack={ () => goHome() }
                      join={ (gameCode, name) => setGame(gameCode, name) }/>,
    [GAME]:         <Game
                      socket={socket}
                      gameCode={gameCode}
                      name={name}
                      exitGame={ () => exitGame(socket) }/>,
    };

  return (
    <div className="App">
      <br/>
      <h3>Pseudonyms</h3>
      <h6>Codenames online</h6>
      <hr/>

      {views[viewState]}

      <Footer/>
    </div>
  );
}

export default App;
