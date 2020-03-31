import React, { useState, useEffect } from 'react';

import PlayerList from '../components/PlayerList';

import { getWordlists } from '../api/api';

function Lobby(props) {
  const [wordlist, setWordlist] = useState('');
  const [wordlists, setWordlists] = useState([]);

  const startGame = () => {
    props.socket.emit('startGame', { options: { wordlist } });
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

  useEffect(() => {
    props.socket.on('options', data => {
      const { options } = data;
      const { wordlist } = options;
      setWordlist(wordlist);
    });
  }, [props.socket]);

  const changeWordlist = (wl) => {
    props.socket.emit('updateOptions', { options: { wordlist: wl } });
  };

  const renderWordlistSelect = () => {
    let options = [];
    for (let wl of wordlists) {
      options.push(<option value={wl}>{wl}</option>)
    }

    return (
      <select className="form-control" value={wordlist} onChange={ e => changeWordlist(e.target.value) }>
        {options}
      </select>
    );
  };

  return (
    <div>
      <h5>Lobby</h5>
      <p>Waiting for players...</p>
      <br/>


      <PlayerList players={props.players}/>
      <br/>

      <h6>Game Settings</h6>

      <p>Wordlist</p>
      {renderWordlistSelect()}
      <br/>

      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-light" onClick={ () => leaveGame() }>Leave Game</button>
        <button type="button" className="btn btn-light" onClick={ () => startGame() }>Start Game</button>
      </div>

    </div>
  );
}

export default Lobby;