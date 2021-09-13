import React from 'react';

import Result from '../game_views/Result';

import { me, board, clues, classic } from './fixtures';

export default function ClassicResult() {
  return (
    <Result
      mode="classic"
      socket={undefined}
      gameHeader={<p>gameheader</p>}
      me={me}
      winner={'red'}
      board={board}
      reveals={classic.reveals}
      keycard={classic.key}
      stats={classic.stats}
      clueHistory={clues}/>
  );
};
