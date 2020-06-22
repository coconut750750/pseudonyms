import React, { useState } from 'react';

import * as classic from './classic';
import * as duet from './duet';
import * as common from './common';

import './Info.css';

export default function Info(props) {
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
    <div className="info">
      <button className={`btn ${open ? "btn-danger" : "btn-dark"}`} onClick={ () => setOpen(true) }>i</button>
      <div className={`infomodal ${open ? "open" : "closed"}`}>
        <p>{text}</p>
      </div>
      <div className={`cover ${open ? "open" : "closed"}`} onClick={ () => setOpen(false) }/>
    </div>
  );
}