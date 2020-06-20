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
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
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