import React, { useState } from 'react';

function Home(props) {
  return (
    <div>
      <div className="row d-flex justify-content-center">
        <button type="button" className="btn btn-light" onClick={props.joinGame}>Join Game</button>
        <button type="button" className="btn btn-light" onClick={props.createGame}>Create Game</button>
      </div>

      <div class="btn-group-vertical">
        <button type="button" class="btn btn-light" onClick={props.viewHowTo}>How to Play</button>
      </div>
    </div>
  )
}

export default Home;