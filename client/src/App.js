import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useParams } from "react-router-dom";
import './App.css';

import io from 'socket.io-client';

import Header from './components/Header';
import UserButton from './auth/UserButton';
import Home from './views/Home';
import Create from './views/Create';
import Join from './views/Join';
import Game from './views/Game';

import { checkCode } from './api/register';
import { getUser } from './api/auth';

import { CLASSIC, RANKED, DUET } from './utils/const';

const HOME = "home";
const JOIN = "join";
const GAME = "game";

function App(props) {
  const { urlgamecode } = useParams();

  const history = useHistory();
  const [viewState, setViewState] = useState(HOME);
  const [gameCode, setGameCode] = useState("");
  const [name, setName] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [socket, setSocket] = useState(undefined);
  const [urlGameCode, setUrlGameCode] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  
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

      setGameCode(gameCode);
      setName(name);
      setGameMode(gameMode);
      setViewState(GAME);
    });
    history.push(`/${gameCode}`);
  };

  const goHome = useCallback(() => {
    history.push('/');
    setUrlGameCode(undefined);
    setViewState(HOME);
  }, [history]);

  const reset = useCallback(() => {
    goHome();
    setGameCode("");
    setName("");
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
          setUrlGameCode(urlgamecode);
          setViewState(JOIN);
        }).catch(resp => {  
          reset();
        });
      } 
    }
  }, [viewState, socket, reset, props]);

  useEffect(() => {
    getUser().then(res => {
      setUsername(res.username)
    }).catch(res => {});
  }, []);

  const createRanked = useCallback(() => {
    if (username === undefined) {
      history.push('/login');
    } else {
      setViewState(RANKED);
    }
  }, [username, history]);

  const views = {
    [HOME]:         <Home 
                      createClassicGame={ () => setViewState(CLASSIC) } 
                      createDuetGame={ () => setViewState(DUET) }
                      createRankedGame={createRanked}
                      joinGame={ () => setViewState(JOIN) }/>,
    [CLASSIC]:      <Create
                      classic
                      username={username}
                      goBack={ () => goHome() }
                      setGame={setGame}/>,
    [DUET]:         <Create
                      duet
                      username={username}
                      goBack={ () => goHome() }
                      setGame={setGame}/>,
    [RANKED]:       <Create
                      ranked
                      username={username}
                      goBack={ () => goHome() }
                      setGame={setGame}/>,
    [JOIN]:         <Join
                      urlGameCode={urlGameCode}
                      username={username}
                      goBack={ () => goHome() }
                      join={setGame}/>,
    [GAME]:         <Game
                      socket={socket}
                      gameCode={gameCode}
                      name={name}
                      gameMode={gameMode}
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
        userButton={<UserButton username={username}/>}
      />

      {views[viewState]}
    </div>
  );
}

export default App;
