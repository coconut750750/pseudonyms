import React, { useState } from 'react';

import "./Donate.css";

function getPrompt() {
  const r = Math.random();
  if (r < 0.5) {
    return "Like the app? Support your local broke college student";
  } else {
    return "I am once again asking for your financial support";
  }
}

export default function Donate(props) {
  const [display, setDisplay] = useState(true);
  const [prompt] = useState(getPrompt());

  if (display) {
    return (
      <div>
        <div className="donate alert alert-info" role="alert">
          <a href="https://www.paypal.me/brandonw4" target="_blank" rel="noopener noreferrer">{prompt}</a>

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