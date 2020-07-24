import React, { useState } from 'react';

import './GameForm.css';

import Create from './Create';
import Join from './Join';


export default function GameForm(props) {
  const join = <Join urlGameCode={props.urlCode} join={props.setGame}/>;
  const create = <Create setGame={props.setGame}/>;

  const tabLabels = ["Join", "Create"];
  const tabs = [join, create];

  const [tab, setTab] = useState(0);

  return (
    <div className="game-form elevated">
      <div className="tabs row d-flex justify-content-center">
        {tabLabels.map((t, i) => (
          <div key={t} className={`col tab ${tab === i ? "selected" : "unselected"}`} onClick={ () => setTab(i) }>
            <h6 className="tab-label">{t}</h6>
          </div>
        ))}
      </div>
      <div className="tab-content row d-flex justify-content-center">
        {tabs.map((t, i) => (
          <div key={i} className={`form ${tab === i ? "show" : "hidden"}`}>
            {tab === i && t}
          </div>
        ))}
      </div>
    </div>
  );
}