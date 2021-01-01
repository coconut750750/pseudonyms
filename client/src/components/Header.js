import React from 'react';

import DarkModeToggle from './DarkModeToggle';

import './Header.css';

export default function Header(props) {
  return (
    <div id="header">
      <div className="row">
        <div className="col-2 d-flex justify-content-center"></div>
        <div className="col-8"><a href="/" tabIndex="-1">
          <h2>
            <div id="header-badge" className="badge badge-light">
              <img id="header-icon" src="/icon.svg" alt=""/>
              Pseudonyms
            </div>
          </h2>
        </a></div>
        <div className="col-2 d-flex justify-content-center flex-column">
          <DarkModeToggle/>
        </div>
      </div>
      <hr/>
    </div>
  );
}