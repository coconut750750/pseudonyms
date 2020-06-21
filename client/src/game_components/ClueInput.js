import React, { useState } from 'react';

function ClueInput(props) {
  const [clue, setClue] = useState("");
  const [count, setCount] = useState(0);

  const submitReady = () => {
    return clue !== "" && count !== 0;
  };

  const sendClue = () => {
    props.socket.emit('sendClue', { word: clue, count });
  };

  const onChangeClue = (val) => {
    const clue = val.split(" ")[0];
    setClue(clue);
  };

  return (
    <div>
      <form onSubmit={ (e) => {
        e.preventDefault();
        sendClue();
      } }>
        <div className="row">
          <div className="col-6 mb-2">
            <input type="text" className="form-control" placeholder="Enter clue" value={clue} onChange={ e => onChangeClue(e.target.value) }/>
          </div>

          <div className="col-6 mb-2">
            <select className="form-control" defaultValue={0} onChange={ e => setCount(e.target.value) }>
              <option value={0} disabled>Clue count</option>
              {[...Array(9).keys()].map(i => <option value={i + 1}>{i + 1}</option>)}
            </select>
          </div>

          <div className="col">
            <button type="submit" className="btn btn-light" disabled={!submitReady()}>Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ClueInput;