import React, { useState, useEffect } from 'react';

import PlayerList from '../components/PlayerList';

import { getWordlists } from '../api/game';

function Lobby(props) {
  const [wordlists, setWordlists] = useState([]);

  const [wordlist, setWordlist] = useState('');

  const [useCustom, setUseCustom] = useState(false);
  const [customWords, setCustomWords] = useState('');

  const startGame = () => {
    if (!useCustom) {
      props.socket.emit('startGame', { options: { wordlist } });
    } else {
      props.socket.emit('startGame', { options: { customWords } });
    }
  };

  const leaveGame = () => {
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
      options.push(<option value={wl}>{wl}</option>)
    }

    return (
      <select className="form-control" value={wordlist} onChange={ e => setWordlist(e.target.value) }>
        {options}
      </select>
    );
  };

  const renderWordlistUpload = () => {
    return (
      <textarea className="form-control" value={customWords} onChange={ e => setCustomWords(e.target.value) } rows="10"></textarea>
    );
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
        <h6>Wordlist</h6>
        {!useCustom &&
          <div>
            <button type="button" className="btn btn-light" onClick={ () => setUseCustom(true) }>Use Custom List</button>
            <br/>
            <br/>
            {renderWordlistSelect()}
          </div>
        }

        {useCustom &&
          <div>
            <button type="button" className="btn btn-light" onClick={ () => setUseCustom(false) }>Use Standard Lists</button>
            <br/>
            <small>Enter each word on a separate line</small>
            {renderWordlistUpload()}
          </div>
        }
        <br/>
      </div>
    );
  };

  return (
    <div>
      <h5>Lobby</h5>
      <h6>Waiting for players...</h6>
      <br/>


      <PlayerList
        players={props.players}
        remove={ canRenderAdmin() ? ((player) => props.socket.emit('removePlayer', { name: player.name })) : undefined }
        removeExempt={props.me}/>
      <br/>

      {renderGameOptions()}

      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-light" onClick={ () => leaveGame() }>Leave Game</button>
        {canRenderAdmin() &&
          <button type="button" className="btn btn-light" onClick={ () => startGame() }>Start Game</button>
        }
      </div>

    </div>
  );
}

export default Lobby;