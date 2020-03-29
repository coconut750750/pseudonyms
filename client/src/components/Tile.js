import React from 'react';

import './Tile.css';

function Tile(props) {
  const click = () => {
    if (props.isKey || !props.active) {
      return;
    }

    props.reveal();
  };

  const tileClass = () => {
    const revealClass = props.revealed ? "revealed" : "hidden";
    const roleClass = props.isKey ? "key" : "player";
    const activeClass = props.active ? "active" : "inactive";
    return `tile ${revealClass} ${roleClass} ${props.color} ${activeClass} card-body`;
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