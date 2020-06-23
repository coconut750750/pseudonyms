import React from 'react';

import Tip from '../tip/Tip';
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

  return (
    <div className="row">
      <h6 className="col-5">
      Game code: <span onClick={() => copyLink()} className="gamecode badge badge-light">{props.gameCode}</span>
      </h6>

      <div className="col-2"/>
      {isClassic(props.mode) &&
        <h6 className="col-5">
        Game mode: <span className="badge badge-primary">Classic</span>
        <Tip classic right help="description"/>
        </h6>
      }
      {isDuet(props.mode) &&
        <h6 className="col-5">
        Game mode: <span className="badge badge-success">Duet</span>
        <Tip duet right help="description"/>
        </h6>
      }
    </div>
  );
}

export default GameBadge;
