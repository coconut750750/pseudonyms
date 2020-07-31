import React from 'react';

import './Toggle.css'

export default function Toggle(props) {
  return (
    <label className="switch">
      <input type="checkbox" checked={props.clicked} onClick={props.onClick}/>
      <span className="slider round"></span>
    </label>
  );
}