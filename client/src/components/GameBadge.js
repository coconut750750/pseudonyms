import React from 'react';

import Tip from './Tip';
import {
  isClassic,
  isDuet,
} from '../utils/const';

import './GameBadge.css';

function GameBadge(props) {
  const copyLink = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    props.copySuccess();
  };

  let gameModeBadge = <div/>
  if (isClassic(props.mode)) {
    gameModeBadge = (
      <h6 className="col-md">
      Game mode: <span className="badge badge-primary">Classic</span>
      <Tip classic right help="description"/>
      </h6>
    );
  } else if (isDuet(props.mode)) {
    gameModeBadge = (
      <h6 className="col-md">
      Game mode: <span className="badge badge-success">Duet</span>
      <Tip duet right help="description"/>
      </h6>
    );
  }

  return (
    <div className="game-badge-row row" style={{}}>
      <div className="tip-toggle" onClick={() => props.setTipsActive(!props.tips)}>
        {props.tips  ? <img alt="" src="/lightbulb-on.svg"/> : <img alt="" src="/lightbulb-off.svg"/>}
      </div>
      <h6 className="col-md">
      Game code: <span onClick={() => copyLink()} className="gamecode badge badge-light">{props.gameCode}</span>
      </h6>

      {gameModeBadge}
    </div>
  );
}

export default GameBadge;
