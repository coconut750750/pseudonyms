import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { CLASSIC, DUET } from '../utils/const';

import ClassicHowTo from '../components/HowTo/classic';
import DuetHowTo from '../components/HowTo/duet';

function HowTo(props) {
  const [mode, setMode] = useState(DUET);

  return (
    <div id="howto" className="p-3">
      <div className="skinny">
        <h4>How To Play</h4>

        <ul className="nav nav-tabs">
          <li className="nav-item" style={{cursor: "pointer"}}>
            <span className={mode === CLASSIC ? "nav-link active" : "nav-link"} onClick={ () => setMode(CLASSIC) }>Classic</span>
          </li>
          <li className="nav-item" style={{cursor: "pointer"}}>
            <span className={mode === DUET ? "nav-link active" : "nav-link "} onClick={ () => setMode(DUET) }>Duet</span>
          </li>
        </ul>
        <br/>
      </div>

      {mode === CLASSIC && <ClassicHowTo/>}
      {mode === DUET && <DuetHowTo/>}

      <Link className="btn" role="button" to="/">Back</Link>
    </div>
  );
}

export default HowTo;