import React, { useState } from 'react';

import "./Donate.css";

export default function Donate(props) {
  const [display, setDisplay] = useState(true);

  if (display) {
    return (
      <div>
        <div className="donate alert alert-info" role="alert">
          <a href="https://www.paypal.me/brandonw4">Help with hosting</a>

          <button className="badge-x" onClick={() => setDisplay(false)}>
            <span/>
          </button>
        </div>
        <br/>
      </div>
    );
  } else {
    return <br/>
  }
}