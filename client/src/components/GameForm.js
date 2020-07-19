import React, { useState } from 'react';

import './GameForm.css';

export default function GameForm(props) {
  const [tab, setTab] = useState(0);

  return (
    <div className="game-form elevated">
      <div className="tabs row d-flex justify-content-center">
        {props.tabLabels.map((t, i) => (
          <div key={t} className={`col tab ${tab === i ? "selected" : "unselected"}`} onClick={ () => setTab(i) }>
            <h6 className="tab-label"> {t}</h6>
          </div>
        ))}
      </div>
      <div className="tab-content row d-flex justify-content-center">
        {props.tabs.map((t, i) => (
          <div key={i} className={`form ${tab === i ? "show" : "hidden"}`}>
            {tab === i && t}
          </div>
        ))}
      </div>
    </div>
  );
}