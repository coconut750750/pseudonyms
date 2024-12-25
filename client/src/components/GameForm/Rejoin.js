import React, { useState, useEffect } from 'react';

import { checkName } from '../../api/register';
import { CLASSIC, DUET } from '../..//utils/const';

function Rejoin({
  join,
}) {
  const [rejoinData, setRejoinData] = useState(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    const { gameCode, name } = JSON.parse(localStorage.getItem("previous_game") || '{}');
    if (gameCode === undefined || name === undefined) {
      return;
    }
    checkName(name, gameCode).then(res => {
      setRejoinData({ gameCode, name, mode: res.mode });
    }).catch(res => {
      setRejoinData(undefined);
    });
  }, []);

  const joinGame = async () => {
    checkName(rejoinData.name, rejoinData.gameCode).then(res => {
      join(rejoinData.gameCode, rejoinData.name, rejoinData.mode);
    }).catch(res => {
      setError(res.message);
    });
  };

  if (rejoinData === undefined) {
    return <></>;
  }

  return (
    <div className="game-form elevated">
      <div className="tabs row d-flex justify-content-center">
        <div className="col tab selected">
          <h6 className="tab-label">Rejoin</h6>
        </div>
      </div>
      <div className="tab-content row d-flex justify-content-center">
        <div className="form">
            <h6 className="pt-2">{rejoinData.mode === CLASSIC ? "Classic" : "Duet"}</h6>
            <h6 className="pt-2">Game Code: {rejoinData.gameCode}</h6>
            <h6 className="pt-2">Name: {rejoinData.name}</h6>

            <p className="form-error">{error}</p>
            <button onClick={joinGame} className="btn mb-2">Rejoin</button>
        </div>
      </div>  
    </div>
  );
}

export default Rejoin;