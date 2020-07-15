import React from 'react';

import './Header.css';

export default function Header(props) {
  return (
    <div id="header">
      <div className="row">
        <div className="col-2 d-flex justify-content-center"></div>
        <div className="col-8"><a href="/" tabIndex="-1"><h3>Pseudonyms</h3></a></div>
        <div className="col-2 d-flex justify-content-center flex-column"></div>
      </div>

      <div className="row">
        <div className="col-2 d-flex justify-content-center"></div>
        <div className="col-8"><h6>Codenames online</h6></div>
        <div className="col-2">{props.tipToggle}</div>
      </div>
      <hr/>
    </div>
  );
}