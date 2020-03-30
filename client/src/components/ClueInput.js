import React, { useState } from 'react';

function ClueInput(props) {
  const [clue, setClue] = useState("");
  const [count, setCount] = useState(0);

  const submitReady = () => {
    return clue !== "" && count !== 0;
  };

  const sendClue = () => {
    props.socket.emit('sendClue', { clue, count });
  };

  const onChangeClue = (val) => {
    const clue = val.split(" ")[0];
    setClue(clue);
  };

  return (
    <div>
      <input type="name" className="form-control" placeholder="Enter your clue" value={clue} onChange={ e => onChangeClue(e.target.value) }/>
      <br/>
      <select className="form-control" onChange={ e => setCount(e.target.value) }>
        <option value={0} disabled selected>Enter your clue count</option>
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
      <br/>
      <button type="button" className="btn btn-light" disabled={!submitReady()} onClick={ () => sendClue() }>Submit Clue</button>
    </div>
  );
}

export default ClueInput;