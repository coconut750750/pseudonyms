import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { CLASSIC, DUET } from '../utils/const';

import ClassicHowTo from '../components/HowTo/classic';

function HowTo(props) {
  const [mode, setMode] = useState(CLASSIC);

  const duetHowto = (
    <div>
      <h5>Introduction</h5>
      <h6>Pseudonyms Duet is a collaborate game based off of the popular board game Codenames. It requires at least 2 players.</h6>

      <h5>Objective</h5>
      <h6>The objective of the game is to correctly identify and reveal all green words based on the clues given by the players on the other team.</h6>

      <h5>The Setup</h5>
      <h6>Players are split into two teams, a red team and a blue team. These teams are working together to identify all the correct words. Players on the red team will give clues for the players on the blue team to guess, and vice versa.</h6>
      <h6>When the game starts, 25 random words from a word list are chosen and placed in a 5 by 5 grid. Each team sees 9 green, 3 black, and 13 white words. Note that a word that appears green to the red team might be green, black, or white to the blue team.</h6>
      <h6>Either team can go first to give a clue; then the turns alternate. </h6>

      <h5>The Clue</h5>
      <h6>A clue consists of one word and one number. Suppose the red team is giving a clue; anyone on the red team can do so. The word should relate to the words that appear green to the red team. The number tells the blue team how many words are related to the clue. </h6>
      <h6>For example, the clue tree: 2 can refer to the words "nut" and "bark"</h6>
      <h6>Rules about what clues are valid are up to you, but Pseudonyms will discourage multi-word clues by restricting the use of spaces and prevent players from giving a clue that exists on the board. </h6>

      <h5>The Reveal</h5>
      <h6>Once the red team submits the clue, anyone on the blue team can guess which words the red team was trying to hint at. They blue team can guess as many words as they want and can end their turn whenever they want, but if a player guesses incorrectly, i.e. revealing a word that appears white to the red team (even if the word appears green to the blue team), the turn ends.</h6>

      <h5>Incorrect Reveals</h5>
      <h6>A player on the blue team guesses incorrectly if the word does not appear green to the red team. The blue team cannot guess that word again, but the red team can still guess that word.</h6>
      <h6>Pseudonyms will indicate incorrect guesses with a badge on the tile. In this case, since the word does not appear green to the red team, a RED badge will appear on that word.</h6>
      <h6>If both a red AND a blue badge appear on a word, that word appears white to both teams, and neither team can guess that word anymore. </h6>
      <h6>If a player reveals a word that appears black to the other team, both teams lose.</h6>

      <h5>Turn Limit and Mistake Limit</h5>
      <h6>To keep the game challenging, you have the ability to select the turn and mistake limit of a game. The default limits are 9 turns and 9 mistakes, meaning if the players cannot guess all the green words within 9 turns, they lose.</h6>
      <h6>The mistake limit need not be the same as the turn limit. For example, players can play a game with a 9 turn limit, but a 2 mistake limit. Once they make two mistakes, future mistakes cost one extra turn.</h6>

      <h5>Sudden Death</h5>
      <h6>After the players run out of turns but still have green words to guess, they enter Sudden Death. They cannot give any more clues, but they can continue guessing. If a word appears green only to the red team, a player on the blue team MUST guess that word to be correct. If either team selects an incorrect guess, the game ends.</h6>

      <h5>Color Distribution</h5>
      <h6>Of the 9 green words one team sees, 3 appear green, 5 appear white, and 1 appears black to the other team.</h6>
      <h6>Of the 3 black words one team sees, 1 appears green, 1 appears white, and 1 appears black to the other team.</h6>

      <h5>The End</h5>
      <h6>The game ends when all green words are revealed, or when the players run out of turns. The game can end early if a player selects a word that appears black to the opposite team.</h6>
    </div>
  );

  return (
    <div id="howto" className="p-3">
      <div className="skinny">
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
      </div>

      {mode === CLASSIC && <ClassicHowTo/>}
      {mode === DUET && duetHowto}

      <Link className="btn" role="button" to="/">Back</Link>
    </div>
  );
}

export default HowTo;