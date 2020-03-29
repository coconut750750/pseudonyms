import React from 'react';

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
