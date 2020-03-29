import React from 'react';

import PlayerList from '../components/PlayerList';

function Lobby(props) {
  const startGame = () => {
    props.socket.emit('startGame', { options: { wordlist: 'test' } });
  };

  return (
    <div>
      <h5>Lobby</h5>
      <PlayerList players={props.players}/>

      <br/>

      <button type="button" className="btn btn-light" onClick={ () => startGame() }>Start Game</button>
    </div>
  );
}

export default Lobby;