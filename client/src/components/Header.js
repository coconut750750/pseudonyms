import React from 'react';
import { Link } from "react-router-dom";

import './Header.css';

export default function Header(props) {
  return (
    <div id="header">
      <Link to="/" tabIndex="-1"><h3>Pseudonyms</h3></Link>
      <div className="row">
        <div className="col-2 d-flex justify-content-center">{props.tipToggle}</div>
        <div className="col-8"><h6>Codenames online</h6></div>
        <div className="col-2 d-flex justify-content-center">{props.userButton}</div>
      </div>
      <hr/>
    </div>
  );
}