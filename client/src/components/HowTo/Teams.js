import React from 'react';

import Player from '../../models/player';
import PlayerBadge from '../PlayerBadge';

const redTeamPlayer1 = new Player("Dopey", false, true, "red", "");
const redTeamPlayer2 = new Player("Sneezy", false, true, "red", "");
const blueTeamPlayer1 = new Player("Grumpy", false, true, "blue", "");
const blueTeamPlayer2 = new Player("Sleepy", false, true, "blue", "");

export default function HowToRoles(props) {
  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-6 d-flex justify-content-center">
          <PlayerBadge player={redTeamPlayer1}/>
          <PlayerBadge player={redTeamPlayer2}/>
        </div>
        <div className="col-6 d-flex justify-content-center">
          <PlayerBadge player={blueTeamPlayer1}/>
          <PlayerBadge player={blueTeamPlayer2}/>
        </div>
      </div>
    </div>
  );
}