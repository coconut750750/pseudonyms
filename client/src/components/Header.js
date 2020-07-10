import React from 'react';

import './Header.css';

export default function Header(props) {
  return (
    <div id="header">
      <a href="/" tabIndex="-1"><h3>Pseudonyms</h3></a>
      <div className="row">
        <div className="col-2 d-flex justify-content-center">{props.tipToggle}</div>
        <div className="col-8"><h6>Codenames online</h6></div>
        <div className="col-2 d-flex justify-content-center">{props.userButton}</div>
      </div>
      <hr/>
    </div>
  );
}