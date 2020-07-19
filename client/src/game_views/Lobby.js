import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import PlayerList from '../components/PlayerList';
import Tip from '../tip/Tip';

import { getWordlists } from '../api/game';
import { isClassic, isDuet } from '../utils/const';

import "./Lobby.css";

const timeLimitOptions = [
  { value: 30, display: "30 seconds"},
  { value: 60, display: "1 minute"},
  { value: 120, display: "2 minutes"},
  { value: 300, display: "5 minutes"},
  { value: 0, display: "unlimited"}
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
    if (isDuet(props.mode)) {
      options = { ...options, timers: turnLimit, mistakes: mistakeLimit };
    }
    props.socket.emit('startGame', { options: options });
  };

  const exitGame = () => {
    props.socket.emit('exitGame', {});
  };

  useEffect(() => {
    if (props.mode !== undefined) {
      getWordlists().then(data => {
        ReactDOM.unstable_batchedUpdates(() => {
          if (isClassic(props.mode)) {
            setWordlist("classic");
          } else if (isDuet(props.mode)) {
            setWordlist("duet");
          }
          setWordlists(data);
        });
      });
    }
  }, [props.mode]);

  const renderWordlistSelect = () => {
    let options = [];
    for (let wl of wordlists) {
      options.push(<option key={wl} value={wl}>{wl}</option>)
    }

    return (
      <select className="form-control gameoptions-select mb-2" value={wordlist} onChange={ e => setWordlist(e.target.value) }>
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
      <div>
        <div className="m-2">
          <small>Time for clue</small>
          <Tip help="timeForClue"/>
          <select className="form-control gameoptions-select" value={clueLimit} onChange={ e => setClueLimit(e.target.value) }>
            {options}
          </select>
        </div>
        <div className="m-2">
          <small>Time for guess</small>
          <Tip right help="timeForGuess"/>
          <select className="form-control gameoptions-select" value={guessLimit} onChange={ e => setGuessLimit(e.target.value) }>
            {options}
          </select>
        </div>
      </div>
    );
  }

  const renderDuetLimits = () => {
    if (isDuet(props.mode)) {
      return (
        <div className="row">
          <div className="col-md m-2">
            <small>Turn limit</small>
            <Tip duet help="turnLimit"/>
            <select className="form-control gameoptions-select" value={turnLimit} onChange={ e => setTurnLimit(e.target.value) }>
              {[...Array(11).keys()].map(i => <option key={i} value={i + 1}>{i + 1}</option>)}
            </select>
          </div>
          <div className="col-md m-2">
            <small>Mistake limit</small>
            <Tip duet right help="mistakeLimit"/>
            <select className="form-control gameoptions-select" value={mistakeLimit} onChange={ e => setMistakeLimit(e.target.value) }>
              {[...Array(12).keys()].map(i => <option key={i} value={i}>{i}</option>)}
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
    return (
      <div>
        <h6>Game Settings</h6>
        <div className="">
          {!useCustom &&
            <div>
              <button type="button" className="btn btn-sm wordlist-toggle" onClick={ () => setUseCustom(true) }>Use Custom Wordlist</button>
              <Tip right help="customWords"/>
              <br/>
              {renderWordlistSelect()}
            </div>
          }

          {useCustom &&
            <div>
              <button type="button" className="btn btn-sm wordlist-toggle" onClick={ () => setUseCustom(false) }>Use Standard Wordlists</button>
              <br/>
              {renderWordlistUpload()}
              <small>Enter each word on a separate line</small>
            </div>
          }

          {renderTimeLimit()}
          {renderDuetLimits()}
        </div>
      </div>
    );
  };

  return (
    <div className="fill-height">
      <h5>Lobby</h5>
      <h6>Click the game code for a shareable link!</h6>

      <div className="row m-2 d-flex justify-content-center">
        <div className="col-md-6">
          <h6>Waiting for players...</h6>

          <PlayerList
            vertical
            players={props.players}
            remove={ canRenderAdmin() ? ((player) => props.socket.emit('removePlayer', { name: player.name })) : undefined }
            removeExempt={props.me}/>
          <br/>
        </div>

        {canRenderAdmin() &&
          <div className="col-md-6">
            {renderGameOptions()}
          </div>
        }
      </div>

      {props.message}

      <div className="mt-3">
        {canRenderAdmin() &&
          <button type="button" className="btn" onClick={ () => startGame() }>Start Game</button>
        }
      </div>
      <div className="mt-3">
        <button type="button" className="btn"
          onClick={ () => exitGame() }>
          {canRenderAdmin() ? "End Game" : "Leave Game"}
        </button>
      </div>
    </div>
  );
}

export default Lobby;