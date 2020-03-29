import React from 'react';

function Result(props) {
  return (
    <div>
      <h5>Game Over</h5>
      <p>{`${props.winner === 'red' ? "Red" : "Blue"} wins!`}</p>
    </div>
  );
}

export default Result;