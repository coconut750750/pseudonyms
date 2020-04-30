import React from 'react';

function Home(props) {
  return (
    <div id="home">
      <div className="d-flex justify-content-center">
        <div className="alert alert-success updates" role="alert">
          <p>New features!</p>
          <p>Added a time limit. Try a speed round, where each turn lasts for 30 seconds!</p>
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
    </div>
  )
}

export default Home;