import React, { useState } from 'react';

import * as classic from './classic';
import * as duet from './duet';
import * as common from './common';

import './Hint.css';

export default function Hint(props) {
  const [open, setOpen] = useState(false);
  
  if (props.help === undefined) {
    return <div/>;
  }

  let text = undefined;
  if (props.classic) {
    text = classic[props.help]
  } else if (props.duet) {
    text = duet[props.help]
  } else {
    text = common[props.help]
  }

  if (text === undefined) {
    return <div/>;
  }

  return (
    <div className="hint">
      <button className={`btn ${open ? "btn-danger" : "btn-dark"}`} onClick={ () => setOpen(true) }>i</button>
      <div className={`hintmodal ${open ? "open" : "closed"} ${props.right ? "right" : "left"}`}>
        <p>{text}</p>
      </div>
      <div className={`cover ${open ? "open" : "closed"}`} onClick={ () => setOpen(false) }/>
    </div>
  );
}