import React from 'react';

import Donate from '../components/Donate';

function Home(props) {
  return (
    <div id="home">
      <div className="d-flex justify-content-center">
        <div className="alert alert-success updates" role="alert">
          <p>New features!</p>
          <p>Tired of copying and pasting the game code? Now you can simply click on a shareable link to join a game!</p>
        </div>
      </div>

      <div className="button-row d-flex justify-content-around">
        <div>
          <button type="button" className="btn btn-light" onClick={props.createClassicGame}>Create<br/>Classic Game</button>
          <p>Two Teams<br/>4+ players</p>
        </div>
        <div>
          <button type="button" className="btn btn-light" onClick={props.createDuetGame}>Create<br/>Duet Game</button>
          <p>Collaborative<br/>2+ players</p>
        </div>
      </div>

      <div class="btn-group-vertical">
        <button type="button" className="btn btn-light" onClick={props.joinGame}>Join Game</button>
        <button type="button" className="btn btn-light" onClick={props.viewHowTo}>How to Play</button>
        <button type="button" className="btn btn-light" onClick={props.viewWalkthrough}>Walkthrough</button>
        <button type="button" className="btn btn-light" onClick={props.viewMoreGames}>More Games</button>
      </div>

      <br/>
      <br/>

      <Donate/>

    </div>
  )
}

export default Home;