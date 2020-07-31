import React, { useState } from 'react';

import HowToTeams from './Teams';
import HowToDuetBoard from './DuetBoard';
import ColorDistribution from './ColorDistribution';

export default function DuetHowTo(props) {
  const [blueTeamView, setBlueTeamView] = useState(false);

  const renderHelpBoard = (props) => {
    return (
      <HowToDuetBoard blueTeamView={blueTeamView} toggleTeamView={() => setBlueTeamView(!blueTeamView)} {...props}/>
    );
  }

  const renderText = () => {
    return (
      <div className="text-left">
        <h5>Objective</h5>
        <h6>The objective of the game is to correctly identify and reveal all green words based on the clues given by the players on the other team.</h6>
        <br/>

        <h5>The Setup</h5>
        <h6>Players are split into two teams, a red and a blue team. These teams are working together to identify all the correct words. The red team will give clues for the blue team to guess, and vice versa.</h6>
        <br/>
        <HowToTeams/>
        <br/>

        <h5>The Start</h5>
        <h6>25 random words from a word list are chosen and placed in a 5 by 5 grid. Each team sees 9 green, 3 black, and 13 white words. The pattern of colors each teams sees are different.</h6>
        <br/>
        {renderHelpBoard()}
        <h6>Either team can go first to give a clue; then the turns alternate. </h6>
        <br/>

        <h5>The Clue</h5>
        <h6>During their turn, anyone on the team can give the other team a clue that consists of one word and one number. The clue should relate to the words that appear green to the clue-giving team. The number tells the guessing team how many words are related to the clue.</h6>
        <h6>For example, the clue egg: 2 can refer to the words "pan" and "chick."</h6>
        <h6>Rules about what clues are valid are up to you, but Pseudonyms will discourage multi-word clues by restricting the use of spaces and prevent players from giving a clue that exists on the board. </h6>
        <br/>

        <h5>The Reveal</h5>
        <h6>Once a team submits the clue, the other team will have a chance to guess which words the clue relates to. When a word is chosen, the color of the word seen by the clue-giving team is revealed to everyone.</h6>
        <br/>
        {renderHelpBoard({ reveal: true })}
        <h6>There is no limit to the number of guesses a team can make. But, if a player guesses incorrectly, i.e. revealing a word that does not appear green to the clue-giving team, their turn ends. The team can also end their turn whenever they want.</h6>
        <h6>If a player guesses a word that appears white to the other team, a badge of the other team's color will appear on that word. The other team can still guess that word during their turn</h6>
        <h6>If both a red and blue badge appear on a word, neither team can guess that word anymore. </h6>
        <br/>
        {renderHelpBoard({ reveal: true, incorrectReveal: true })}
        <h6>If a player reveals a word that appears black to the other team, both teams lose.</h6>
        <br/>

        <h5>Turn Limit and Mistake Limit</h5>
        <h6>To keep the game challenging, there are configurable limits to the number of turns and allowed mistakes to the game. The default limits are 9 turns and 9 mistakes, meaning if the players cannot guess all the green words within 9 turns, they lose.</h6>
        <h6>The mistake limit can't be more than the turn limit. If players reach the mistake limit, subsequent mistakes cost one turn.</h6>
        <br/>

        <h5>Sudden Death</h5>
        <h6>If there are green words left to guess after the turn limit is reached, players enter Sudden Death. They can continue guessing without additional clues. If a word appears green only to the red team, a player on the blue team MUST guess that word to be correct. The game ends if anyone guesses incorrectly.</h6>
        <br/>

        <h5>Color Distribution</h5>
        <h6>The color of the words follows this diagram. This could help you figure out what colors the other team sees.</h6>
        <h6>One team sees the top row; the other team sees the bottom row.</h6>
        <br/>
        <ColorDistribution/>
        <br/>

        <h5>The End</h5>
        <h6>The game ends when all green words are revealed, or when the players run out of turns. The game can end early if a player selects a word that appears black to the other team.</h6>
        <br/>
        {renderHelpBoard({ revealAll: true, incorrectReveal: true })}
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