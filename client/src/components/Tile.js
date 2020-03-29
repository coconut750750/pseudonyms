import React from 'react';

import './Tile.css';

const colors = {
  r: "#ff0000", 
  b: "#0000ff",
  y: "#ffff00",
  x: "#000000",
  w: "#ffffff",
}

function Tile(props) {
  const click = () => {
    if (props.isKey) {
      return;
    }

    props.reveal();
  };

  const tileClass = () => {
    return `tile ${props.isKey ? "key" : "player"} card-body`;
  };

  const tileBackground = () => {
    if (props.color === undefined) {
      return colors['w'];
    }
    return colors[props.color];
  };

  const tileStyle = () => {
    return {
      backgroundColor: tileBackground(),
    };
  };

  return (
    <div className={tileClass()} onClick={ () => click() } style={tileStyle()}>
      <h5 className="card-title">{props.word}</h5>
    </div>
  );
}

export default Tile;