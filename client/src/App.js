import React, { useState } from 'react';
import './App.css';

import io from 'socket.io-client';

import Home from './views/Home';
import HowTo from './views/HowTo';
import Create from './views/Create';
import Join from './views/Join';
import Game from './views/Game';

const HOME = "home";
const HOWTO = "howto";
const CREATE = "create";
const JOIN = "join";
const GAME = "game";

function App() {
  const [viewState, setViewState] = useState(HOME);
  const [gameCode, setGameCode] = useState("");
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(undefined);

  const socketiohost = process.env.NODE_ENV === "development" ? 'localhost:5000' : '';

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
  }

  const exitGame = (socket) => {
    socket.emit('exitGame', {});
    socket.disconnect();
    reset();
  }

  const reset = () => {
    setViewState(HOME);
    setGameCode("");
    setName("");
  }

  const views = {
    [HOME]:   <Home 
              createGame={ () => setViewState(CREATE) } 
              joinGame={ () => setViewState(JOIN) }
              viewHowTo={ () => setViewState(HOWTO) }/>,
    [HOWTO]:  <HowTo
              goBack={ () => setViewState(HOME) }/>,
    [CREATE]: <Create
              goBack={ () => setViewState(HOME) }
              setGame={ (gameCode, name) => setGame(gameCode, name) }/>,
    [JOIN]:   <Join
              goBack={ () => setViewState(HOME) }
              join={ (gameCode, name) => setGame(gameCode, name) }/>,
    [GAME]:  <Game
              socket={socket}
              gameCode={gameCode}
              name={name}
              exitGame={ () => exitGame(socket) }/>,
    };

  return (
    <div className="App">
      <br/>
        <h3>Pseudonyms</h3>
      <hr/>

      {views[viewState]}

      <hr/>
      <div>
        <small>built by <a href="https://brandon-wang.me">brandon wang</a></small>
      </div>
    </div>
  );
}

export default App;
