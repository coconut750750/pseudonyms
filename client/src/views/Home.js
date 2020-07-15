import React from 'react';
import { Link } from "react-router-dom";

// import Donate from '../components/Donate';
import GameForm from '../components/GameForm';

import './Home.css';

function Home(props) {
  return (
    <div id="home">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="col-md-6 text-center">
          <div className="alert alert-success updates" role="alert">
            <p>New features!</p>
            <p>New game mode: Duet! This mode is made for 2+ players, as a collaborative twist on the classic game. But be careful, there are more black words.</p>
            <p>Tips: Tips are designed to guide newer players through the game. Click on a Tip, which appears as an "i," to read relevant rules. Experienced players can click the in-game lightbulb to turn them off.</p>
          </div>
        </div>
        <div className="col-md-6 text-center">
          <GameForm
            tabLabels={["Join", "Classic", "Duet"]}
            tabs={[props.join, props.classic, props.duet]}
          />

          <br/>
          
          <div className="btn-group-horizontal">
            <Link className="btn btn-sm btn-light m-2" role="button" to="/howto">How to Play</Link>
            <Link className="btn btn-sm btn-light m-2" role="button" to="/walkthrough">Walkthrough</Link>
            <Link className="btn btn-sm btn-light m-2" role="button" to="/moregames">More Games</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;