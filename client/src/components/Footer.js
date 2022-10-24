import React from 'react';
import { Link } from "react-router-dom";

import './Footer.css'

function Footer() {
  return (
    <div id="footer">
      <div id="footer-content">
        <div className="button-row d-flex justify-content-center">
          <div className="col text-center">
            <Link className="link" to="/feedback"><small>Submit feedback</small></Link>
          </div>
          <div className="col text-center">
            <Link className="link" to="/moregames"><small>More games</small></Link>
          </div>
          <div className="col text-center">
            <a className="link" target="_blank" rel="noopener noreferrer" href="https://www.buymeacoffee.com/brandonwang"><small>Support me</small></a>
          </div>
        </div>
        <div id="built-by" className="text-center">
          <small>Built by <a className="link" href="https://brandon-wang.com" target="_blank" rel="noopener noreferrer" tabIndex="-1">Brandon Wang</a></small>
        </div>
      </div>
    </div>
  );
}

export default Footer;