import React from 'react';
import { Link } from "react-router-dom";

import GameForm from '../components/GameForm';

import './Home.css';

function Home(props) {
  return (
    <div id="home">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="col-md-6 text-center">
          <div className="alert alert-success updates" role="alert">
            <p>New features!</p>
            <p>At the end of the game, we'll show you how the game played out. 
            See what the best clues were, which turns took the longest, or when the losing team caught up! </p>
          </div>
        </div>
        <div className="col-md-6 text-center">
          <GameForm
            urlCode={props.urlCode}
            setGame={props.setGame}
          />

          <br/>
          
          <div>
            <Link className="btn btn-sm m-1" role="button" to="/howto">How to Play</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;