import React from 'react';

import PlayerList from '../components/PlayerList';

function Lobby(props) {
  return (
    <div>
      <h5>Lobby</h5>
      <PlayerList players={props.players}/>

      <br/>

      <button type="button" className="btn btn-light" onClick={ () => props.socket.emit('startGame', {}) }>Start Game</button>
    </div>
  );
}

export default Lobby;