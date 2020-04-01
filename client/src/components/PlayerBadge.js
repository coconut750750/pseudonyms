import React from 'react';

import './PlayerBadge.css';

function PlayerBadge(props) {
  const getBadgeClass = () => {
    if (!props.player.active) {
      return "badge-light";
    } else if (props.player.isRed()) {
      return "badge-danger";
    } else if (props.player.isBlue()) {
      return "badge-primary";
    } else {
      return "badge-dark";
    }
  }

  const getRoleClass = () => {
    return props.player.isKey() ? "key" : "player";
  };

  return (
    <div className={`badge m-2 ${getBadgeClass()} ${getRoleClass()}`}>
      { props.player.name }

      {props.remove !== undefined &&
      <button className="badge-x" onClick={() => props.remove(props.player)}>
        <span/>
      </button>
      }
    </div>
  );
}

export default PlayerBadge;
