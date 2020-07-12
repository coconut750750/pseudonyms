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
import { useAuth } from "./auth/useAuth.js";

import { CLASSIC, RANKED, DUET } from './utils/const';

const HOME = "home";
const JOIN = "join";
const GAME = "game";

function App(props) {
  const auth = useAuth();
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
        if (resp.mode === RANKED && auth.user === undefined) {
          history.push({ pathname: '/login', state: { redirect: `/${urlgamecode}` }});
        } else {
          setViewState(JOIN);
        }
      }).catch(resp => {  
        goHome();
      });
    }
  }, [viewState, goHome, urlgamecode, history, auth]);

  const createRanked = useCallback(() => {
    if (auth.user === undefined) {
      history.push('/login');
    } else {
      setViewState(RANKED);
    }
  }, [auth, history]);

  const views = {
    [HOME]:         <Home 
                      createClassicGame={ () => setViewState(CLASSIC) } 
                      createDuetGame={ () => setViewState(DUET) }
                      createRankedGame={createRanked}
                      joinGame={ () => setViewState(JOIN) }/>,
    [CLASSIC]:      <Create
                      classic
                      username={auth.user?.username}
                      goBack={goHome}
                      setGame={setGame}/>,
    [DUET]:         <Create
                      duet
                      username={auth.user?.username}
                      goBack={goHome}
                      setGame={setGame}/>,
    [RANKED]:       <Create
                      ranked
                      username={auth.user?.username}
                      goBack={goHome}
                      setGame={setGame}/>,
    [JOIN]:         <Join
                      urlGameCode={urlgamecode}
                      username={auth.user?.username}
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
        userButton={<UserButton username={auth.user?.username}/>}
      />

      {views[viewState]}
    </div>
  );
}

export default App;
