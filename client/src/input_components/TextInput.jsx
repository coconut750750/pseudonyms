import React, { forwardRef } from 'react';

import './TextInput.css';

function TextInput(props) {
  return (
    <div className="form-group md">
      <label>{props.label}</label>
      <input type="text" className="form-control" ref={props.fref} {...props}/>
    </div>
  );
}

export default forwardRef((props, ref) => {
  return <TextInput {...props} fref={ref}/>
})