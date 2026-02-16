import React, { useState, useRef } from 'react';

import TextInput from '../..//input_components/TextInput';

import { checkName } from '../../api/register';

function Join(props) {
  const nameInputRef = useRef();
  const gameCodeInputRef = useRef();
  const [error, setError] = useState("");

  const joinGame = async () => {
    const name = nameInputRef.current.value.trim();
    const gameCode = gameCodeInputRef.current.value.toLowerCase();
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

        <div className="game-code-input">
          <TextInput
            label={"Game Code:"}
            ref={gameCodeInputRef}
            value={props.urlGameCode}
            disabled={props.urlGameCode !== undefined}/>
        </div>

        <TextInput
          label={"Name:"}
          ref={nameInputRef}/>

        <p className="form-error">{error}</p>
        <button type="submit" className="btn mb-2">Join</button>
      </form>
    </div>
  );
}

export default Join;