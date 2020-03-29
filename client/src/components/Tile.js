import React from 'react';

import './Tile.css';

function Tile(props) {
  return (
    <div className="tile card-body" onClick={() => alert(props.word)}>
      <h5 className="card-title">{props.word}</h5>
    </div>
  );
}

export default Tile;