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

  const setGame = (gameCode, name) => {
    let socket = io('localhost:5000');
    socket.on('end', data => {
      exitGame();
    });
    socket.on('disconnect', data => {
      reset();
    });
    setSocket(socket);

    setGameCode(gameCode);
    setName(name);
    setViewState(GAME);
  }

  const exitGame = () => {
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
              exitGame={ () => exitGame() }/>,
    };

  return (
    <div className="App">
      <br/>
      <h3>Pseudonyms</h3>
      <hr/>

      {views[viewState]}
    </div>
  );
}

export default App;
