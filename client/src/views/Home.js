import React from 'react';

import Donate from '../components/Donate';

function Home(props) {
  return (
    <div id="home">
      <div className="d-flex justify-content-center">
        <div className="alert alert-success updates" role="alert">
          <p>New features!</p>
          <p>Added a new game mode: Duet! Work with a group as small as 2 people to guess all the green words. Be careful though, there are more black words in this mode.</p>
          <p>Spend less time explaining/reading rules, and more time playing, with Hints! Hints are scattered throughout the game to guide unexperienced players through the game. Simply click on the "i" icon to read more about relevant rules. Veterans of the game can also turn them off.</p>
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