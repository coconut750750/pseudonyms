import React, { useRef } from 'react';

import { checkName, createClassicGame, createDuetGame, createRankedGame } from '../api/register';
import WrappedMessage from '../components/WrappedMessage';

function Create(props) {
  const nameInputRef = useRef();

  const create = async () => {
    const name = nameInputRef.current.value;
    checkName(name).then(res => {
      const createSuccess = res => {
        props.setGame(res.gameCode, name, res.mode);
      }
      const createFail = res => {
        props.setError(res.message);
      }

      if (props.classic) {
        createClassicGame({}).then(createSuccess).catch(createFail);
      } else if (props.duet) {
        createDuetGame({}).then(createSuccess).catch(createFail);
      } else if (props.ranked) {
        createRankedGame({}).then(createSuccess).catch(createFail);
      }
    }).catch(res => {
        props.setError(res.message);
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
        <input type="text" className="form-control" placeholder="Enter your name"
          ref={nameInputRef}
          value={props.username}
          disabled={props.username !== undefined}/>
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