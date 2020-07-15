import React, { useState, useRef } from 'react';

import { checkName } from '../api/register';

function Join(props) {
  const nameInputRef = useRef();
  const gameCodeInputRef = useRef();
  const [error, setError] = useState("");

  const joinGame = async () => {
    const name = nameInputRef.current.value;
    const gameCode = gameCodeInputRef.current.value;
    checkName(name, gameCode).then(res => {
      props.join(gameCode, name, res.mode);
    }).catch(res => {
      setError(res.message);
    });
  };

  return (
    <div>
      <form onSubmit={ (e) => {
        e.preventDefault();
        joinGame();
      } }>
        <input type="text" className="form-control" placeholder="Enter game code (4 characters)"
          ref={gameCodeInputRef}
          value={props.urlGameCode}
          disabled={props.urlGameCode !== undefined}/>
        <br/>
        <input type="text" className="form-control" placeholder="Enter your name"
          ref={nameInputRef}/>
        <br/>

        <div className="button-row d-flex justify-content-around">
          <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
          <button type="submit" className="btn btn-light">Join</button>
        </div>
        <p className="form-error">{error}</p>
      </form>
    </div>
  );
}

export default Join;