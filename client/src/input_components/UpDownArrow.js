import React from 'react';

import './UpDownArrow.css';

export default function UpDownArrow(props) {
  return (
    <span className={`updownarrow ${props.up ? "up" : "down"}`}/>
  );
}