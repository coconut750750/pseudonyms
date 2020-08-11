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
            <p>Clue history: Added a new component next to the board to track the clues that have been given. </p>
            <p style={{color: 'black'}}>Dark Mode!!! Try the toggle in the upper right corner.</p>
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