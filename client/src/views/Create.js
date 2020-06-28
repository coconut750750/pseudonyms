import React, { useRef } from 'react';

import { checkName, createClassicGame, createDuetGame } from '../api/register';
import WrappedMessage from '../components/WrappedMessage';

function Create(props) {
  const nameInputRef = useRef();

  const create = async () => {
    const name = nameInputRef.current.value;
    checkName(name).then(res => {
      if (!res.valid) {
        props.setError(res.message);
        return;
      }

      const createSuccess = res => {
        props.setGame(res.gameCode, name, res.mode);
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
        <input type="text" className="form-control" placeholder="Enter your name" ref={nameInputRef}/>
        <br />

        <div className="button-row d-flex justify-content-around">
          <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
          <button type="submit" className="btn btn-light">Create</button>
        </div>
      </form>
    </div>
  )
}

export default WrappedMessage(Create);