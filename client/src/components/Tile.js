import React from 'react';

import './Tile.css';

function Tile(props) {
  const click = () => {
    if (props.isKey) {
      return;
    }

    props.reveal();
  };

  const tileClass = () => {
    return `tile ${props.revealed ? "revealed" : "hidden"} ${props.isKey ? "key" : "player"} ${props.color} card-body`;
  };

  const tileStyle = () => {
    return {
    };
  };

  return (
    <div className={tileClass()} onClick={ () => click() } style={tileStyle()}>
      <h5 className="card-title">
        <p>{props.word}</p>
      </h5>
    </div>
  );
}

export default Tile;