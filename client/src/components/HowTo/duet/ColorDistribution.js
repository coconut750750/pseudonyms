import React from 'react';

import './ColorDistribution.css';

const {
  GREEN_TILE: G,
  WHITE_TILE: Y,
  BLACK_TILE: X,
} = require('../../../utils/const');

const topRowGreens = [G,G,G,G,G,G,G,G,G,Y,Y,Y,Y,Y,X];
const botRowGreens = [X,Y,Y,Y,Y,Y,G,G,G,G,G,G,G,G,G];
const topRowOthers = [Y,Y,Y,Y,Y,Y,Y,Y,X,X];
const botRowOthers = [Y,Y,Y,Y,Y,Y,Y,X,Y,X];

export default function ColorDistribution(props) {
  const renderDualRow = (top, bot) => (
    <div>
      <div className='row mb-2'>
        {top.map(c => (
          <span className={`tile-icon ${c}`}>{" "}</span>
        ))}
      </div>
      <div className='row'>
        {bot.map(c => (
          <span className={`tile-icon ${c}`}>{" "}</span>
        ))}
      </div>
    </div>
  );

  const renderGreenRow = () => (
    <div>
      {renderDualRow(topRowGreens, botRowGreens)}
    </div>
  );

  const renderOtherRow = () => (
    <div>
      {renderDualRow(topRowOthers, botRowOthers)}
    </div>
  );

  return (
    <div className='row d-flex justify-content-center'>
      <div className='col-1-md p-0 mb-3'>
        {renderGreenRow()}
      </div>
      <div className='col-1-md p-0'>
        {renderOtherRow()}
      </div>
    </div>
  );
}