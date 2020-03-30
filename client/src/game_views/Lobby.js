import React from 'react';

import PlayerList from '../components/PlayerList';

function Lobby(props) {
  const startGame = () => {
    props.socket.emit('startGame', { options: { wordlist: 'basic' } });
  };

  const leaveGame = () => {
    props.socket.emit('exitGame', {});
  };

  return (
    <div>
      <h5>Lobby</h5>
      <PlayerList players={props.players}/>

      <br/>


      <div className="row d-flex justify-content-center">
        <button type="button" className="btn btn-light" onClick={ () => leaveGame() }>Leave Game</button>
        <button type="button" className="btn btn-light" onClick={ () => startGame() }>Start Game</button>
      </div>

    </div>
  );
}

export default Lobby;