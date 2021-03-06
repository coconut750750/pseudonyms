import React from 'react';

import './PlayerBadge.css';

function PlayerBadge(props) {
  const getBadgeClass = () => {
    if (!props.player.active) {
      return "badge-empty";
    } else if (props.player.isRed()) {
      return "badge-danger";
    } else if (props.player.isBlue()) {
      return "badge-primary";
    } else {
      return "badge-active";
    }
  }

  const getRoleClass = () => {
    return props.player.isCaptain() ? "captain" : "player";
  };

  return (
    <div className={`badge m-1 ${getBadgeClass()} ${getRoleClass()}`}>
      {props.player.isCaptain() &&
        <img className="captain-icon" src="/icon.svg" alt=""/>
      }
      
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
