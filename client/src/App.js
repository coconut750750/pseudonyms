import React, { useState } from 'react';
import './App.css';

import io from 'socket.io-client';

import Home from './views/Home';
// import HowTo from './views/HowTo';
import Create from './views/Create';
import Join from './views/Join';
// import Game from './views/Game';

const HOME = "home";
const HOWTO = "howto";
const CREATE = "create";
const JOIN = "join";
const GAME = "game";

function App() {
  const [viewState, setViewState] = useState(HOME);
  const [gameCode, setGameCode] = useState("");
  const [name, setName] = useState("");

  let socket = undefined;

  const setGame = (gameCode, name) => {
    setGameCode(gameCode);
    setName(name);
    setViewState(GAME);

    alert(gameCode);

    socket = io();
  }

  const exitGame = () => {
    socket.emit('exitGame', {});
    socket.disconnect();
    setViewState(HOME);
    setGameCode("");
    setName("");
  }

  const views = {
    home:   <Home 
              createGame={ () => setViewState(CREATE) } 
              joinGame={ () => setViewState(JOIN) }
              viewHowTo={ () => setViewState(HOWTO) }/>,
    // howto:  <HowTo
    //           goBack={ () => this.setState({ viewState: "home" }) }/>,
    create: <Create
              goBack={ () => setViewState(HOME) }
              setGame={ (gameCode, name) => setGame(gameCode, name) }/>,
    join:   <Join
              goBack={ () => setViewState(HOME) }
              join={ (gameCode, name) => setGame(gameCode, name) }/>,
    // game:  <Game
    //           socket={socket}
    //           gameCode={gameCode}
    //           name={name}
    //           exitGame={ () => this.exitGame() }/>,
    };

  return (
    <div className="App">
      {views[viewState]}
    </div>
  );
}

export default App;
