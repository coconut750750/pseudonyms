import React from 'react';

function Score(props) {

  return (
    <div className="row">
      {props.score !== undefined && [
        <div className="col-2"><h5>{`${props.score.red}`}</h5></div>,
        <div className="col-8"></div>,
        <div className="col-2"><h5>{`${props.score.blue}`}</h5></div>
      ]}
    </div>
  );
}

export default Score;