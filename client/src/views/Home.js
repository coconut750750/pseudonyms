import React from 'react';
import { Link } from "react-router-dom";

import Donate from '../components/Donate';

function Home(props) {
  return (
    <div id="home">
      <div className="d-flex justify-content-center">
        <div className="alert alert-success updates" role="alert">
          <p>New features!</p>
          <p>New game mode: Duet! This mode is made for 2+ players, as a collaborative twist on the classic game. But be careful, there are more black words.</p>
          <p>Tips: Tips are designed to guide newer players through the game. Click on a Tip, which appears as an "i," to read relevant rules. Experienced players can click the in-game lightbulb to turn them off.</p>
        </div>
      </div>

      <div className="button-row d-flex justify-content-between">
        <div>
          <button type="button" className="btn btn-light main-btn" onClick={props.createRankedGame}>Create<br/>Ranked Game</button>
          <p>Competitive<br/>4+ players</p>
        </div>
        <div>
          <button type="button" className="btn btn-light main-btn" onClick={props.createClassicGame}>Create<br/>Classic Game</button>
          <p>Casual<br/>4+ players</p>
        </div>
        <div>
          <button type="button" className="btn btn-light main-btn" onClick={props.createDuetGame}>Create<br/>Duet Game</button>
          <p>Collaborative<br/>2+ players</p>
        </div>
      </div>

      <div className="button-row d-flex justify-content-center">
        <button type="button" className="btn btn-light main-btn" onClick={props.joinGame}>Join Game</button>
      </div>
      <br/>
      
      <div className="btn-group-vertical">
        <Link className="btn btn-sm btn-light" role="button" to="/howto">How to Play</Link>
        <Link className="btn btn-sm btn-light" role="button" to="/walkthrough">Walkthrough</Link>
        <Link className="btn btn-sm btn-light" role="button" to="/feedback">Submit Feedback</Link>
        <Link className="btn btn-sm btn-light" role="button" to="/moregames">More Games</Link>
      </div>

      <br/>
      <br/>

      <Donate/>

    </div>
  )
}

export default Home;