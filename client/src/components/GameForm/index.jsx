import React, { useState, useEffect } from 'react';

import './GameForm.css';

import Create from './Create';
import Join from './Join';
import Rejoin from './Rejoin';

export default function GameForm({
  urlCode,
  setGame,
}) {
  const setGameWrapper = (gameCode, name, mode) => {
    localStorage.setItem('previous_game', JSON.stringify({ gameCode, name }));
    setGame(gameCode, name, mode);
  };

  const create = <Create setGame={setGameWrapper}/>;
  const join = <Join urlGameCode={urlCode} join={setGameWrapper}/>;

  const tabLabels = ["Create", "Join"];
  const tabs = [create, join];

  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (urlCode !== undefined) {
      setTab(1);
    }
  }, [urlCode]);

  return (
    <>
      <Rejoin join={setGameWrapper}/>
      <br/>

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
    </>
  );
}