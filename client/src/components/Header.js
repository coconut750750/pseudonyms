import React from 'react';

import './Header.css';

export default function Header(props) {
  return (
    <div id="header">
      <h3>Pseudonyms</h3>
      <div className="row">
        <div className="col-2"/>
        <div className="col-8"><h6>Codenames online</h6></div>
        <div className="col-2">{props.tipToggle}</div>
      </div>
      <hr/>
    </div>
  );
}