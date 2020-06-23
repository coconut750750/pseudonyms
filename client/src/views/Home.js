import React from 'react';

import Donate from '../components/Donate';

function Home(props) {
  return (
    <div id="home">
      <div className="d-flex justify-content-center">
        <div className="alert alert-success updates" role="alert">
          <p>New features!</p>
          <p>New game mode: Duet! This mode is made for 2+ players, as a collaborative twist on the classic game. But be careful, there are more black words.</p>
          <p>Tips: Tips are designed to guide newer players through the game. Click on a Tip, which appears as an "i," to read relevant rules. Experienced players can click the lightbulb turn them off.</p>
        </div>
      </div>

      <div className="button-row d-flex justify-content-around">
        <div>
          <button type="button" className="btn btn-light" onClick={props.createClassicGame}>Create<br/>Classic Game</button>
          <p>Competitive<br/>4+ players</p>
        </div>
        <div>
          <button type="button" className="btn btn-light" onClick={props.createDuetGame}>Create<br/>Duet Game</button>
          <p>Collaborative<br/>2+ players</p>
        </div>
      </div>

      <div className="btn-group-vertical">
        <button type="button" className="btn btn-light" onClick={props.joinGame}>Join Game</button>
        <a href="/howto"><button type="button" className="btn btn-light">How to Play</button></a>
        <a href="/walkthrough"><button type="button" className="btn btn-light">Walkthrough</button></a>
        <a href="/more"><button type="button" className="btn btn-light">More Games</button></a>
      </div>

      <br/>
      <br/>

      <Donate/>

    </div>
  )
}

export default Home;