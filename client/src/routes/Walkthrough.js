import React, { useState } from 'react';

import { CLASSIC, DUET } from '../utils/const';

const classicScreens = ["lobby", "teams", "roles", "clue", "guess"];
const duetScreens = ["lobby", "teams", "clue", "guess", "suddendeath"];
const classicDescription = {
  lobby: "This is the lobby screen. As you wait for players to join, you can set some game settings. Once you have at least four players, you can start the game.",
  teams: "This is the team selection screen. Players can select their own teams, or randomize the teams. Everyone must be on a team before advancing.",
  roles: "In this screen, one player from each team voluntarily elects themselves as the Captain. Each team needs one Captain.",
  clue: "This is what a Captain will see once the game has started. He/she types a clue and selects a clue count below. Non-Captain players will not see the color of the words.",
  guess: "Non-Captain players will guess words based off the clue. The color of the word won't be revealed until after they have clicked a word.",
}
const duetDescription = {
  lobby: "This is the lobby screen. As you wait for players to join, you can set some game settings. Once you have at least two players, you can start the game.",
  teams: "This is the team selection screen. Players can select their own teams, or randomize the teams. Everyone must be on a team before advancing.",
  clue: "This is what players see once the game has started. During the turn, anyone on a team can submit a clue. Players from the other team will see different colors on each word.",
  guess: "Players on the other team will guess words based off the clue. The color of the word won't be revealed until after they have clicked a word.",
  suddendeath: "One players run out of turns, they can continune guessing without any more clues. If they guess all the green words, they win. But an incorrect guess will lose the game.",
}
const slides = {
  classic: {
    screens: classicScreens,
    descriptions: classicDescription,
  },
  duet: {
    screens: duetScreens,
    descriptions: duetDescription,
  },
}

function Walkthrough(props) {
  const [mode, setMode] = useState(CLASSIC);
  const [screen, setScreen] = useState(0);

  const goLeft = (mode, currentScreen) => {
    setScreen(Math.max(0, currentScreen - 1));
  };

  const goRight = (mode, currentScreen) => {
    setScreen(Math.min(slides[mode].screens.length - 1, currentScreen + 1));
  };

  const switchTab = (mode) => {
    setMode(mode);
    setScreen(0);
  };

  const getDescription = (mode, screen) => {
    return slides[mode].descriptions[slides[mode].screens[screen]];
  };

  const getImage = (mode, screen) => {
    return `/walkthrough/${mode}/${getScreen(mode, screen)}.png`;
  };

  const getScreen = (mode, screen) => {
    return slides[mode].screens[screen];
  };

  return (
    <div id="walkthrough">
      <h4>Walkthrough</h4>

      <ul className="nav nav-tabs">
        <li className="nav-item" style={{cursor: "pointer"}}>
          <span className={mode === CLASSIC ? "nav-link active" : "nav-link"} onClick={ () => switchTab(CLASSIC) }>Classic</span>
        </li>
        <li className="nav-item" style={{cursor: "pointer"}}>
          <span className={mode === DUET ? "nav-link active" : "nav-link "} onClick={ () => switchTab(DUET) }>Duet</span>
        </li>
      </ul>
      <br/>

      <small>{getDescription(mode, screen)}</small>
      <div className="justify-content-between">
        <div className="arrow" onClick={ () => goLeft(mode, screen) }>
          {screen > 0 &&
            <i id="left-arrow"></i>
          }
        </div>
        <img className="screen" src={getImage(mode, screen)} alt={getScreen(mode, screen)}/>
        <div className="arrow" onClick={ () => goRight(mode, screen) }>
          {screen < slides[mode].screens.length - 1 &&
            <i id="right-arrow"></i>
          }
        </div>
      </div>
      <a href="/"><button type="button" className="btn btn-light">Back</button></a>
    </div>
  );
}

export default Walkthrough;