import React, { useState, useEffect, useRef } from 'react';

import { checkName, createClassicGame, createDuetGame } from '../api/register';

function Create(props) {
  const nameInputRef = useRef();
  const [error, setError] = useState("");

  const create = async () => {
    const name = nameInputRef.current.value;
    checkName(name).then(res => {
      const createSuccess = res => {
        props.setGame(res.gameCode, name, res.mode);
      }

      if (props.classic) {
        createClassicGame({}).then(createSuccess);
      } else if (props.duet) {
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
        <input type="text" className="form-control" placeholder="Enter your name" ref={nameInputRef}/>
        <br />

        <div className="button-row d-flex justify-content-around">
          <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
          <button type="submit" className="btn btn-light">Create</button>
        </div>
        <p className="form-error">{error}</p>
      </form>
    </div>
  )
}

export default Create;