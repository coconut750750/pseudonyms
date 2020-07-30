import React, { useState } from 'react';

import HowToRoles from './Roles';
import HowToClassicBoard from './ClassicBoard';

export default function ClassicHowTo(props) {
  const [captainView, setCaptainView] = useState(false);

  const renderText = () => {
    return (
      <div className="text-left">
        <h5>Objective</h5>
        <h6>The objective of the game is for each team to correctly identify and reveal their respective words based on the clues given by their "Captain."</h6>
        <br/>
  
        <h5>The Setup</h5>
        <h6>Players are split into two teams, a red team and a blue team. Then, each team elects one player to be the Captain (more on the Captain's role later).</h6>
        <br/>
        <HowToRoles/>
        <br/>
  
        <h5>The Start</h5>
        <h6>25 random words from a word list are chosen and placed in a 5 by 5 grid. Each word can be one of four colors: red, blue, black, and white. At first, only the Captains know the colors.</h6>
        <h6>9 words will have the color of the team that goes first, which is chosen at random; 8 words will have the color of the other team. 7 words are white, and 1 word is black.</h6>
        <br/>
        <HowToClassicBoard captainView={captainView} toggleCaptainView={() => setCaptainView(!captainView)}/>
        <br/>
  
        <h5>The Clue</h5>
        <h6>During their turn, Captains give their team a clue that consists of one word and one number. The clue should relate to the words of the Captain's team color. The number tells the Captain’s team how many words are related to the clue. </h6>
        <h6>For example, the clue cards: 2 could refer to the words "play" and "deck."</h6>
        <h6>Rules about what clues are valid are up to you, but Pseudonyms will discourage multi-word clues by restricting the use of spaces and prevent the Captain from giving a clue that exists on the board. </h6>
        <br/>
  
        <h5>The Reveal</h5>
        <h6>Once the Captain submits the clue, other players on the team will have a chance to guess which words the Captain is trying to hint at. When a word is chosen, the color of the word is revealed to everyone.</h6>
        <h6>There is a limit to the number of guesses the team can make, and if a player guesses incorrectly, i.e. revealing a word that is not their team color, their turn ends. The team can also end their turn whenever they want.</h6>
        <h6>If a player reveals the black word, their team instantly loses.</h6>
        <br/>
        <HowToClassicBoard captainView={captainView} toggleCaptainView={() => setCaptainView(!captainView)} reveal/>
        <br/>
  
        <h5>The End</h5>
        <h6>The game ends when all of words for one team are revealed. The game can end early if the black word is revealed.</h6>
        <br/>
        <HowToClassicBoard captainView={captainView} toggleCaptainView={() => setCaptainView(!captainView)} revealAll/>
        <br/>
      </div>
    );
  };

  return (
    <div className="skinny">
      {renderText()}
    </div>
  );
}