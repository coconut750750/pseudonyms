import React from 'react';

import TileText from '../TileText';

import '../Tile.css';
import './DuetTile.css';

import { RED, BLUE, WHITE_TILE } from "../../utils/const";

function DuetTile(props) {
  const { reveals } = props;
  let tokens = [];
  let fillColor = undefined;
  reveals.forEach(rev => {
    if (rev.color === WHITE_TILE) {
      tokens.push(rev.team);
    } else {
      fillColor = rev.color;
    }
  });

  const click = () => {
    if (!props.active) {
      return;
    }

    props.reveal();
  };

  const tileClass = () => {
    const color = fillColor || props.color || "";
    const glow = props.glow === undefined ? "" : `glow-${props.glow}`;
    const revealClass = fillColor === undefined ? "hidden" : "revealed";
    const activeClass = props.active ? "active" : "inactive";
    return `tile ${revealClass} ${color} ${glow} ${activeClass}`;
  };

  return (
    <div className={tileClass()} onClick={ () => click() }>
      {tokens.includes(RED) &&
        <h4 className="token badge badge-danger"><span/></h4>
      }
      {tokens.includes(BLUE) &&
        <h4 className="token badge badge-primary"><span/></h4>
      }
      <TileText text={props.word}/>
    </div>
  );
}

export default DuetTile;