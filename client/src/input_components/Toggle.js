import React from 'react';

import './Toggle.css'

export default function Toggle(props) {
  return (
    <label className="switch">
      <input tabIndex="-1" type="checkbox" checked={props.clicked} onClick={props.onClick}/>
      <span className="slider round"></span>
    </label>
  );
}