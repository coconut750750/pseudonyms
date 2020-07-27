import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { CLASSIC, DUET } from '../utils/const';

function HowTo(props) {
  const [mode, setMode] = useState(CLASSIC);

  const classicHowto = (
    <div>
      <h6>Introduction</h6>
      <p>Pseudonyms Classic is a team-based board game based off of the popular board game Codenames. It requires at least 4 players.</p>

      <h6>Objective</h6>
      <p>The objective of the game is for each team to correctly identify and reveal their respective words based on the clues given by their "Captain."</p>

      <h6>The Setup</h6>
      <p>Players are split into two teams, a red team and a blue team. Each team elects one player to be the Captain (more on the Captain's role later).</p>

      <h6>The Start</h6>
      <p>25 random words from a word list are chosen and placed in a 5 by 5 grid. Each word can be one of four colors: red, blue, black, and white. At first, only the Captains know the colors.</p>
      <p>9 words will have the color of the team that goes first, which is chosen at random; 8 words will have the color of the other team. 7 words are white, and 1 word is black.</p>

      <h6>The Clue</h6>
      <p>On their turn, Captains give their team a clue that consists of one word and one number. The word should relate to the words of the Captain's team color. The number tells the Captain’s team how many words are related to the clue. </p>
      <p>For example, the clue tree: 2 can refer to the words "nut" and "bark."</p>
      <p>Rules about what clues are valid are up to you, but Pseudonyms will discourage multi-word clues by restricting the use of spaces and prevent the Captain from giving a clue that exists on the board. </p>

      <h6>The Reveal</h6>
      <p>Once the Captain submits the clue, other players on the team will have a chance to guess which words the Captain is trying to hint at. When a word is chosen, the color of the word is revealed to everyone.</p>
      <p>There is a limit to the number of guesses the team can make, and if a player guesses incorrectly, i.e. revealing a word that is not their team color, their turn ends. The team can also end their turn whenever they want.</p>
      <p>If a player reveals the black word, their team instantly loses.</p>

      <h6>The End</h6>
      <p>The game ends when all of words for one team are revealed. The game can end early if the black word is revealed.</p>
    </div>
  );

  const duetHowto = (
    <div>
      <h6>Introduction</h6>
      <p>Pseudonyms Duet is a collaborate game based off of the popular board game Codenames. It requires at least 2 players.</p>

      <h6>Objective</h6>
      <p>The objective of the game is to correctly identify and reveal all green words based on the clues given by the players on the other team.</p>

      <h6>The Setup</h6>
      <p>Players are split into two teams, a red team and a blue team. These teams are working together to identify all the correct words. Players on the red team will give clues for the players on the blue team to guess, and vice versa.</p>
      <p>When the game starts, 25 random words from a word list are chosen and placed in a 5 by 5 grid. Each team sees 9 green, 3 black, and 13 white words. Note that a word that appears green to the red team might be green, black, or white to the blue team.</p>
      <p>Either team can go first to give a clue; then the turns alternate. </p>

      <h6>The Clue</h6>
      <p>A clue consists of one word and one number. Suppose the red team is giving a clue; anyone on the red team can do so. The word should relate to the words that appear green to the red team. The number tells the blue team how many words are related to the clue. </p>
      <p>For example, the clue tree: 2 can refer to the words "nut" and "bark"</p>
      <p>Rules about what clues are valid are up to you, but Pseudonyms will discourage multi-word clues by restricting the use of spaces and prevent players from giving a clue that exists on the board. </p>

      <h6>The Reveal</h6>
      <p>Once the red team submits the clue, anyone on the blue team can guess which words the red team was trying to hint at. They blue team can guess as many words as they want and can end their turn whenever they want, but if a player guesses incorrectly, i.e. revealing a word that appears white to the red team (even if the word appears green to the blue team), the turn ends.</p>

      <h6>Incorrect Reveals</h6>
      <p>A player on the blue team guesses incorrectly if the word does not appear green to the red team. The blue team cannot guess that word again, but the red team can still guess that word.</p>
      <p>Pseudonyms will indicate incorrect guesses with a badge on the tile. In this case, since the word does not appear green to the red team, a RED badge will appear on that word.</p>
      <p>If both a red AND a blue badge appear on a word, that word appears white to both teams, and neither team can guess that word anymore. </p>
      <p>If a player reveals a word that appears black to the other team, both teams lose.</p>

      <h6>Turn Limit and Mistake Limit</h6>
      <p>To keep the game challenging, you have the ability to select the turn and mistake limit of a game. The default limits are 9 turns and 9 mistakes, meaning if the players cannot guess all the green words within 9 turns, they lose.</p>
      <p>The mistake limit need not be the same as the turn limit. For example, players can play a game with a 9 turn limit, but a 2 mistake limit. Once they make two mistakes, future mistakes cost one extra turn.</p>

      <h6>Sudden Death</h6>
      <p>After the players run out of turns but still have green words to guess, they enter Sudden Death. They cannot give any more clues, but they can continue guessing. If a word appears green only to the red team, a player on the blue team MUST guess that word to be correct. If either team selects an incorrect guess, the game ends.</p>

      <h6>Color Distribution</h6>
      <p>Of the 9 green words one team sees, 3 appear green, 5 appear white, and 1 appears black to the other team.</p>
      <p>Of the 3 black words one team sees, 1 appears green, 1 appears white, and 1 appears black to the other team.</p>

      <h6>The End</h6>
      <p>The game ends when all green words are revealed, or when the players run out of turns. The game can end early if a player selects a word that appears black to the opposite team.</p>
    </div>
  );

  return (
    <div className="skinny">
      <div className="text-left">
        <h4>How To Play</h4>

        <ul className="nav nav-tabs">
          <li className="nav-item" style={{cursor: "pointer"}}>
            <span className={mode === CLASSIC ? "nav-link active" : "nav-link"} onClick={ () => setMode(CLASSIC) }>Classic</span>
          </li>
          <li className="nav-item" style={{cursor: "pointer"}}>
            <span className={mode === DUET ? "nav-link active" : "nav-link "} onClick={ () => setMode(DUET) }>Duet</span>
          </li>
        </ul>
        <br/>

        {mode === CLASSIC && classicHowto}
        {mode === DUET && duetHowto}

        <Link className="btn" role="button" to="/">Back</Link>
      </div>
    </div>
  );
}

export default HowTo;