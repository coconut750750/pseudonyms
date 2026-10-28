import React from 'react';

import TileText from '../TileText';

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
    const roleClass = props.showKey ? "key" : "player";
    const activeClass = props.active ? "active" : "inactive";
    return `tile ${revealClass} ${roleClass} ${props.color} ${activeClass}`;
  };

  return (
    <div className={tileClass()} onClick={ () => click() }>
      <TileText text={props.word}/>
    </div>
  );
}

export default ClassicTile;