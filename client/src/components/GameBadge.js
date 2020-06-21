import React from 'react';

const style = {
    boxShadow: "0px 0px 8px 0px #21252999",
    cursor: "pointer",
}

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
    <div className="d-flex justify-content-between">
      <h6 className>
      Game code: <span onClick={() => copyLink()} className="badge badge-light" style={style}>{props.gameCode}</span>
      </h6>

      {props.typeChecks.classic() &&
        <h6>
        Game type: <span className="badge badge-primary">Classic</span>
        </h6>
      }
      {props.typeChecks.duet() &&
        <h6>
        Game type: <span className="badge badge-success">Duet</span>
        </h6>
      }
    </div>
  );
}

export default GameBadge;
