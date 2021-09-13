import React from 'react';

import Result from '../game_views/Result';

import { me, board, clues, duet } from './fixtures';

export default function DuetResult() {
  return (
    <Result
      mode="duet"
      socket={undefined}
      gameHeader={<p>gameheader</p>}
      me={me}
      winner={'red'}
      board={board}
      reveals={duet.reveals}
      keycard={duet.key}
      stats={duet.stats}
      clueHistory={clues}/>
  );
};
