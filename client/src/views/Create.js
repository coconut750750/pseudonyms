import React, { useState, useCallback } from 'react';
import debounce from "lodash/debounce";

import { checkName, createClassicGame, createDuetGame } from '../api/register';

function Create(props) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const debounceDisappear = () => setMessage("");
  const disappearCallback = useCallback(debounce(debounceDisappear, 5000), []);

  const create = async () => {
    checkName(name).then(res => {
      if (!res.valid) {
        setMessage(res.message);
        disappearCallback();
        return;
      }

      const createSuccess = res => {
        props.setGame(res.gameCode, name);
      }

      if (props.duet) {
        createDuetGame({}).then(createSuccess);
      } else {
        createClassicGame({}).then(createSuccess);
      }
    });
  }

  let header = "Create Game";
  if (props.classic) {
    header = "Create Classic Game";
  } else if (props.duet) {
    header = "Create Duet Game";
  }

  return (
    <div>
      <h4>{header}</h4>

      <form onSubmit={ (e) => {
        e.preventDefault();
        create();
      } }>
        <input type="text" className="form-control" placeholder="Enter your name" value={name} onChange={ e => setName(e.target.value) }/>
        <br />

        <div className="button-row d-flex justify-content-around">
          <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
          <button type="submit" className="btn btn-light">Create</button>
        </div>
      </form>

      {message && <div className="alert alert-danger" role="alert">
        {message}
      </div>}
    </div>
  )
}

export default Create;