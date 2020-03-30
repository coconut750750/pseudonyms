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
    return `tile ${revealClass} ${roleClass} ${props.color} ${activeClass}`;
  };

  return (
    <div className={tileClass()} onClick={ () => click() }>
      <div className="card-title">
        <p>{props.word}</p>
      </div>
    </div>
  );
}

export default Tile;