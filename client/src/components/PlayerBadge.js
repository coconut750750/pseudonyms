import React from 'react';

function PlayerBadge(props) {
  const getBadgeClass = () => {
    if (!props.player.active) {
      return "badge-light";
    // } else if (props.player.team !== undefined) {
    //   return props.player.isDefending() ? "badge-primary" : "badge-secondary";
    } else {
      return "badge-dark";
    }
  }

  const getStyle = () => {
    return {};
  }

  return (
    <div
      className={`badge m-2 ${getBadgeClass()}`}
      style={getStyle()}>{ props.player.name }</div>
  );
}

export default PlayerBadge;
