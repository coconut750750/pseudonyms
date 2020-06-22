import React, { useState, useEffect } from 'react';

import PlayerList from '../components/PlayerList';
import Info from '../info/Info';

import { getWordlists } from '../api/game';

import "./Lobby.css";

const timeLimitOptions = [
  { value: 30, display: "30 seconds"},
  { value: 60, display: "1 minute"},
  { value: 120, display: "2 minutes"},
  { value: 300, display: "5 minutes"},
  { value: 0, display: "Unlimited"}
];

function Lobby(props) {
  const [wordlists, setWordlists] = useState([]);

  const [wordlist, setWordlist] = useState('');

  const [useCustom, setUseCustom] = useState(false);
  const [customWords, setCustomWords] = useState('');

  const [clueLimit, setClueLimit] = useState(0);
  const [guessLimit, setGuessLimit] = useState(0);

  const [turnLimit, setTurnLimit] = useState(9);
  const [mistakeLimit, setMistakeLimit] = useState(9);

  const startGame = () => {
    let options = { clueLimit, guessLimit };
    if (!useCustom) {
      options = { ...options, wordlist };
    } else {
      options = { ...options, customWords };
    }
    if (props.typeChecks.duet) {
      options = { ...options, timers: turnLimit, mistakes: mistakeLimit };
    }
    props.socket.emit('startGame', { options: options });
  };

  const exitGame = () => {
    props.socket.emit('exitGame', {});
  };

  useEffect(() => {
    getWordlists().then(data => {
      setWordlist(data[0]);
      setWordlists(data);
    });
  }, []);

  const renderWordlistSelect = () => {
    let options = [];
    for (let wl of wordlists) {
      options.push(<option key={wl} value={wl}>{wl}</option>)
    }

    return (
      <select className="form-control gameoptions-select" value={wordlist} onChange={ e => setWordlist(e.target.value) }>
        {options}
      </select>
    );
  };

  const renderWordlistUpload = () => {
    return (
      <textarea className="form-control" value={customWords} onChange={ e => setCustomWords(e.target.value) } rows="10"></textarea>
    );
  }

  const renderTimeLimit = () => {
    let options = [];
    for (let tl of timeLimitOptions) {
      options.push(<option key={tl.value} value={tl.value}>{tl.display}</option>)
    }

    return (
      <div className="row">
        <div className="col-6">
          <small>Time for clue</small>
          <Info help="timeForClue"/>
          <select className="form-control gameoptions-select" value={clueLimit} onChange={ e => setClueLimit(e.target.value) }>
            {options}
          </select>
        </div>
        <div className="col-6">
          <small>Time for guess</small>
          <Info help="timeForGuess"/>
          <select className="form-control gameoptions-select" value={guessLimit} onChange={ e => setGuessLimit(e.target.value) }>
            {options}
          </select>
        </div>
      </div>
    );
  }

  const renderDuetLimits = () => {
    if (props.typeChecks.duet()) {
      return (
        <div className="row">
          <div className="col-6">
            <small>Turn limit</small>
            <Info duet help="turnLimit"/>
            <select className="form-control gameoptions-select" value={turnLimit} onChange={ e => setTurnLimit(e.target.value) }>
              {[...Array(11).keys()].map(i => <option value={i + 1}>{i + 1}</option>)}
            </select>
          </div>
          <div className="col-6">
            <small>Mistake limit</small>
            <Info duet help="mistakeLimit"/>
            <select className="form-control gameoptions-select" value={mistakeLimit} onChange={ e => setMistakeLimit(e.target.value) }>
              {[...Array(12).keys()].map(i => <option value={i}>{i}</option>)}
            </select>
          </div>
        </div>
      );
    }
  }

  const canRenderAdmin = () => {
    return props.me !== undefined && props.me.isAdmin;
  }

  const renderGameOptions = () => {
    if (!canRenderAdmin()) {
      return undefined;
    }

    return (
      <div>
        <h6>Game Settings</h6>
        <div className="">
          {!useCustom &&
            <div>
              <button type="button" className="btn btn-light btn-sm wordlist-toggle" onClick={ () => setUseCustom(true) }>Use Custom Wordlist</button>
              <br/>
              {renderWordlistSelect()}
            </div>
          }

          {useCustom &&
            <div>
              <button type="button" className="btn btn-light btn-sm wordlist-toggle" onClick={ () => setUseCustom(false) }>Use Standard Wordlists</button>
              <br/>
              {renderWordlistUpload()}
              <small>Enter each word on a separate line</small>
            </div>
          }
          <br/>

          {renderTimeLimit()}
          <br/>
          {renderDuetLimits()}

          <br/>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h5>Lobby</h5>
      <h6>Click the game code for a shareable link!</h6>
      <h6>Waiting for players...</h6>
      <br/>


      <PlayerList
        players={props.players}
        remove={ canRenderAdmin() ? ((player) => props.socket.emit('removePlayer', { name: player.name })) : undefined }
        removeExempt={props.me}/>
      <br/>

      {renderGameOptions()}

      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-light"
          onClick={ () => exitGame() }>
          {canRenderAdmin() ? "End Game" : "Leave Game"}
        </button>
        
        {canRenderAdmin() &&
          <button type="button" className="btn btn-light" onClick={ () => startGame() }>Start Game</button>
        }
      </div>

    </div>
  );
}

export default Lobby;