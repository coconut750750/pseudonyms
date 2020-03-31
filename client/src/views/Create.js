import React, { useState, useCallback } from 'react';

import { checkName, createGame } from '../api/api';
import debounce from "lodash/debounce";

function Create(props) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const debounceDisappear = () => setMessage("");
  const disappearCallback = useCallback(debounce(debounceDisappear, 1000), []);

  const create = async () => {
    checkName(name).then(res => {
      if (!res.valid) {
        setMessage(res.message);
        disappearCallback();
        return;
      }

      createGame({}).then(res => {
        props.setGame(res.gameCode, name);
      });
    });
  }

  return (
    <div>
      <h4>Create Game</h4>

      <input type="name" className="form-control" placeholder="Enter your name" value={name} onChange={ e => setName(e.target.value) }/>
      <br />

      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
        <button type="button" className="btn btn-light" onClick={ () => create() }>Create</button>
      </div>

      {message && <div class="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  )
}

export default Create;