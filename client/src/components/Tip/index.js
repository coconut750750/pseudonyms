import React from 'react';

import * as classic from './classic';
import * as duet from './duet';
import * as common from './common';

import './Tip.css';

export default function Tip(props) {
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
    <div className="tip">
      <svg viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor" stroke="currentColor" strokeLinecap="square" strokeWidth="2"><circle cx="12" cy="12" fill="none" r="11" stroke="currentColor"></circle><line fill="none" x1="11.959" x2="11.959" y1="11" y2="17"></line><circle cx="11.959" cy="7" r="1" stroke="none"></circle></g></svg>
      <div className={`tipmodal ${props.right ? "right" : "left"}`}>
        <p>{text}</p>
      </div>
    </div>
  );
}