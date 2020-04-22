import React, { useState } from 'react';

import "./Donate.css";

const altPrompts = [
  "I need money for Chipotle",
  "Help me pay my taxes",
  "If you won't support Wikipedia, at least support me",
  "Feet pics?"
];

function getPrompt() {
  if (Math.random() < 0.5) {
    return "Like the app? Support your local broke college student";
  } else {
    const i = Math.floor(Math.random() * altPrompts.length);
    return altPrompts[i];
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