import React, { useState, useRef } from 'react';

import TextInput from '../..//input_components/TextInput';

import { checkName } from '../../api/register';

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

        <TextInput
          label={"Game Code:"}
          ref={gameCodeInputRef}
          value={props.urlGameCode}
          disabled={props.urlGameCode !== undefined}/>

        <TextInput
          label={"Name:"}
          ref={nameInputRef}/>
        <br/>

        <button type="submit" className="btn mb-2">Join</button>
        <p className="form-error">{error}</p>
      </form>
    </div>
  );
}

export default Join;