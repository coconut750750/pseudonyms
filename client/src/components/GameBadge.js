import React from 'react';

import Tip from '../tip/Tip';
import {
  isClassic,
  isDuet,
  isRanked,
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
  if (isRanked(props.mode)) {
    gameModeBadge = (
      <h6 className="col-5">
      Game mode: <span className="badge badge-danger">Ranked</span>
      <Tip classic right help="description"/>
      </h6>
    );
  } else if (isClassic(props.mode)) {
    gameModeBadge = (
      <h6 className="col-5">
      Game mode: <span className="badge badge-primary">Classic</span>
      <Tip classic right help="description"/>
      </h6>
    );
  } else if (isDuet(props.mode)) {
    gameModeBadge = (
      <h6 className="col-5">
      Game mode: <span className="badge badge-success">Duet</span>
      <Tip duet right help="description"/>
      </h6>
    );
  }

  return (
    <div className="row">
      <h6 className="col-5">
      Game code: <span onClick={() => copyLink()} className="gamecode badge badge-light">{props.gameCode}</span>
      </h6>

      <div className="col-2"/>
      {gameModeBadge}
    </div>
  );
}

export default GameBadge;
