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
            <p>Revamped UI. I made some changes to the user interface, and better support for mobile. Let me know what's working and what's not by leaving feedback below.</p>
            <p>New game mode: Duet! This mode is made for 2+ players, as a collaborative twist on the classic game. But be careful, there are more black words.</p>
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