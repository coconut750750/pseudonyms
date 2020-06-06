import React from 'react';

import Donate from '../components/Donate';

function Home(props) {
  return (
    <div id="home">
      <div className="d-flex justify-content-center">
        <div className="alert alert-success updates" role="alert">
          <p>New features!</p>
          <p>The game will display the number of clues a team has left. The maximum number of guesses per turn is the count given by the Key plus 1.</p>
          <p>Tired of copying and pasting the game code? Now you can simply click on the shareable link to join a game!</p>
        </div>
      </div>

      <div className="button-row d-flex justify-content-around">
        <button type="button" className="btn btn-light" onClick={props.joinGame}>Join Game</button>
        <button type="button" className="btn btn-light" onClick={props.createGame}>Create Game</button>
      </div>

      <div class="btn-group-vertical">
        <button type="button" className="btn btn-light" onClick={props.viewHowTo}>How to Play</button>
        <button type="button" className="btn btn-light" onClick={props.viewWalkthrough}>Walkthrough</button>
      </div>

      <br/>
      <br/>

      <Donate/>

    </div>
  )
}

export default Home;