import React from 'react';

import '../Tile.css';
import './ClassicTile.css';

function ClassicTile(props) {
  const click = () => {
    if (!props.active) {
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
      <h6>{props.word}</h6>
    </div>
  );
}

export default ClassicTile;