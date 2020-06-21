import React, { useState } from 'react';

const screenOrder = ["lobby", "teams", "roles", "clue", "guess"];
const description = {
  lobby: "This is the lobby screen. As you wait for players to join, you can set some game settings. Once you have at least four players, you can start the game.",
  teams: "This is the team selection screen. Players can select their own teams, or randomize the teams. Everyone must be on a team before advancing.",
  roles: "In this screen, one player from each team voluntarily elects themselves as the Key. Each team needs one Key.",
  clue: "This is what a Key will see once the game has started. He/she types a clue and selects a clue count below. Non-Key players will not see the color of the words.",
  guess: "Non-Key players will guess words based off the clue. The color of the word won't be revealed until after they have clicked a word.",
}

function Walkthrough(props) {
  const [screen, setScreen] = useState(0);

  const goLeft = (currentScreen) => {
    setScreen(Math.max(0, currentScreen - 1));
  };

  const goRight = (currentScreen) => {
    setScreen(Math.min(screenOrder.length - 1, currentScreen + 1));
  };

  return (
    <div id="walkthrough">
      <h4>Walkthrough</h4>
      <small>{description[screenOrder[screen]]}</small>
      <div className="justify-content-between">
        <div className="arrow" onClick={ () => goLeft(screen) }>
          {screen > 0 &&
            <i id="left-arrow"></i>
          }
        </div>
        <img className="screen" src={`images/${screenOrder[screen]}.png`} alt={screenOrder[screen]}/>
        <div className="arrow" onClick={ () => goRight(screen) }>
          {screen < screenOrder.length - 1 &&
            <i id="right-arrow"></i>
          }
        </div>
      </div>
      <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
    </div>
  );
}

export default Walkthrough;