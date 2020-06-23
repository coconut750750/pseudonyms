import React from 'react';

const games = [
  {name: "Connoisseurs", description: "Based on Cards Against Humanity", link: "https://connoisseurs.brandon-wang.com/"},
  {name: "Red Flags", description: "Based on Red Flags the card game", link: "https://redflagsio.herokuapp.com/"},
  {name: "Secret Hitler", link: "http://www.secrethitler.party/"},
  {name: "Drawphone", description: "Telephone with pictures", link: "https://drawphone.tannerkrewson.com/"},
  {name: "Netgames", description: "Avalon, Love Letter, One Night Ultimate Werewolf & more", link: "https://netgames.io/games/"},
];

export default function MoreGames(props) {
  return (
    <div id="moregames">
      <h4>More Games</h4>
      <br/>

      {games.map(g => (
        <div className="games-outer">
          <h5><a href={g.link}>{g.name}</a></h5>
          {g.description && <p>{g.description}</p>}
          <br/>
        </div>
      ))}

      <a href="/"><button type="button" className="btn btn-light">Back</button></a>
    </div>
  )
}