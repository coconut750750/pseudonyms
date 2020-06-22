import React, { useState, useCallback } from 'react';
import debounce from "lodash/debounce";

import { checkName } from '../api/register';

function Join(props) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState(props.urlGameCode);

  const debounceDisappear = () => setMessage("");
  const disappearCallback = useCallback(debounce(debounceDisappear, 5000), []);

  const joinGame = async () => {
    checkName(name, gameCode).then(res => {
      if (!res.valid) {
        setMessage(res.message);
        disappearCallback();
        return;
      }

      props.join(gameCode, name, res.type);
    });
  };

  return (
    <div>
      <h4>Join Game</h4>

      <form onSubmit={ (e) => {
        e.preventDefault();
        joinGame();
      } }>
        <input type="text" className="form-control" placeholder="Enter game code (4 characters)" 
          value={gameCode}
          disabled={props.urlGameCode !== undefined}
          onChange={ e => setGameCode(e.target.value.toLowerCase()) }/>
        <br/>
        <input type="text" className="form-control" placeholder="Enter your name" 
          value={name} 
          onChange={ e => setName(e.target.value) }/>
        <br/>

        <div className="button-row d-flex justify-content-around">
          <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
          <button type="submit" className="btn btn-light">Join</button>
        </div>
      </form>

      {message && <div className="alert alert-danger message" role="alert">
        {message}
      </div>}
    </div>
  );
}

export default Join;