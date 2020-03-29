import React, { useState } from 'react';

import { checkName, checkCode } from '../api/api';

function Join(props) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const joinGame = async () => {
    checkCode(gameCode).then(res => {
      if (!res.valid) {
        setMessage(res.message);
        return;
      }

      checkName(name, gameCode).then(res => {
        if (!res.valid) {
          setMessage(res.message);
          return;
        }

        props.join(gameCode, name);
      });
    });
  };

  return (
    <div>
      <h5>Join Game</h5>

      <input type="name" className="form-control" placeholder="Enter game code" 
        value={gameCode} 
        onChange={ e => setGameCode(e.target.value) }/>
      <br/>
      <input type="name" className="form-control" placeholder="Enter your name" 
        value={name} 
        onChange={ e => setName(e.target.value) }/>
      <br/>

      <div className="row d-flex justify-content-center">
        <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
        <button type="button" className="btn btn-light" onClick={ () => joinGame() }>Join</button>
      </div>

      {message && <div class="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  );
}

export default Join;