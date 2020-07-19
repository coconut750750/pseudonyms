import React, { useState, useRef } from 'react';

import TextInput from '../input_components/TextInput';
import { checkName, createClassicGame, createDuetGame } from '../api/register';
import { CLASSIC, DUET } from '../utils/const';

import "./Create.css";

function Create(props) {
  const nameInputRef = useRef();
  const [error, setError] = useState("");
  const [gameMode, setMode] = useState(CLASSIC);

  const create = async () => {
    const name = nameInputRef.current.value;
    checkName(name).then(res => {
      const createSuccess = res => {
        props.setGame(res.gameCode, name, res.mode);
      }

      if (gameMode === CLASSIC) {
        createClassicGame({}).then(createSuccess);
      } else if (gameMode === DUET) {
        createDuetGame({}).then(createSuccess);
      }
    }).catch(res => {
        setError(res.message);
    });
  }

  return (
    <div>
      <form onSubmit={ (e) => {
        e.preventDefault();
        create();
      } }>
        <div className="btn-group btn-group-toggle mt-4">
          <label className={`game-mode-radio ${gameMode === CLASSIC ? 'selected' : 'unselected'}`} onClick={() => setMode(CLASSIC)}>
            <input type="radio" name="options" id="option1" autocomplete="off"/> Classic
          </label>
          <label className={`game-mode-radio ${gameMode === DUET ? 'selected' : 'unselected'}`} onClick={() => setMode(DUET)}>
            <input type="radio" name="options" id="option2" autocomplete="off"/> Duet
          </label>
        </div>

        <TextInput
          label={"Name:"}
          ref={nameInputRef}/>
        <br />

        <button type="submit" className="btn mb-2">Create</button>
        <p className="form-error">{error}</p>
      </form>
    </div>
  )
}

export default Create;