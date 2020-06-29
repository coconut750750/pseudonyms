import React from 'react';

import { FIRST_TURN, SUDDEN_DEATH, otherTeam } from '../../utils/const';

import Tip from '../../tip/Tip';

export default function duetTurnDescriptor({ turn, clueActive }) {
  let text = "";
  let tip = undefined;

  if (turn === FIRST_TURN) {
    text = "First Turn";
    tip = <Tip duet right help="firstTurn"/>;
  } else if (turn === SUDDEN_DEATH) {
    text = "Sudden Death";
    tip = <Tip duet right help="suddenDeath"/>;
  } else {
    const teamName = turn.replace(/^\w/, c => c.toUpperCase());
    const otherTeamName = otherTeam(turn).replace(/^\w/, c => c.toUpperCase());
    if (!clueActive) {
      text = `${teamName} giving clue`;
    } else {
      text = `${otherTeamName} guessing`;
    }
  }

  return (
    <h6 className="mb-1">{text}{tip}</h6>
  );
}