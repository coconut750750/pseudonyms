import React from 'react';

import PlayerList from '../components/PlayerList';

function GameHeader(props) {

  const getReds = () => {
    return props.players.filter(p => p.isRed());
  };

  const getBlues = () => {
    return props.players.filter(p => p.isBlue());
  };

  return (
    <div>
      <div className="row">
        {props.score !== undefined && [
          <div className="col-4"><h5>{`${props.score.red}`}</h5></div>,
          <div className="col-4"></div>,
          <div className="col-4"><h5>{`${props.score.blue}`}</h5></div>
        ]}
      </div>
      <div className="row">
        <div className="col-4"><PlayerList players={getReds()}/></div>
        <div className="col-4"></div>
        <div className="col-4"><PlayerList players={getBlues()}/></div>
      </div>
    </div>
  );
}

export default GameHeader;