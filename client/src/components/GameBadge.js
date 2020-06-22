import React from 'react';

import Info from '../info/Info';

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
      {props.typeChecks.classic() &&
        <h6 className="col-5">
        Game type: <span className="badge badge-primary">Classic</span>
        <Info classic help="description"/>
        </h6>
      }
      {props.typeChecks.duet() &&
        <h6 className="col-5">
        Game type: <span className="badge badge-success">Duet</span>
        <Info duet help="description"/>
        </h6>
      }
    </div>
  );
}

export default GameBadge;
