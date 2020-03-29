import React, { useState } from 'react';
import './App.css';

import Home from './views/Home';
// import HowTo from 'views/HowTo';
// import Create from 'views/Create';
// import Join from 'views/Join';
// import Game from 'views/Game';

const viewStates = ["home", "howto", "create", "join", "game"];

function App() {
  const [viewState, setViewState] = useState(viewStates[0]);
  const [gameCode, setGameCode] = useState("");
  const [name, setName] = useState("");

  const views = {
    home:   <Home 
              createGame={ () => this.setState({ viewState: "create" }) } 
              joinGame={ () => this.setState({ viewState: "join" }) }
              viewHowTo={ () => this.setState({ viewState: "howto" }) }/>,
    // howto:  <HowTo
    //           goBack={ () => this.setState({ viewState: "home" }) }/>,
    // create: <Create
    //           goBack={ () => this.setState({ viewState: "home" }) }
    //           create={ (name, options) => createGame(options).then(res => this.setGame(res.gameCode, name)) }/>,
    // join:   <Join
    //           goBack={ () => this.setState({ viewState: "home" }) }
    //           join={ (gameCode, name) => this.setGame(gameCode, name) }/>,
    // game:  <Lobby
    //           socket={this.socket}
    //           gameCode={this.state.gameCode}
    //           name={this.state.name}
    //           exitGame={ () => this.exitGame() }/>,
    };

  return (
    <div className="App">
      {views[viewState]}
    </div>
  );
}

export default App;
