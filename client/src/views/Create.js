import React, { useState } from 'react';

import { checkName, createGame } from '../api/api';

function Create(props) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const create = async () => {
    checkName(name).then(res => {
      if (!res.valid) {
        setMessage(res.message);
        return;
      }

      createGame({}).then(res => {
        props.setGame(res.gameCode, name);
      });
    });
  }

  return (
    <div>
      <h5>Create Game</h5>

      <input type="name" className="form-control" placeholder="Enter your name" value={name} onChange={ e => setName(e.target.value) }/>
      <br />

      <div className="row d-flex justify-content-center">
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