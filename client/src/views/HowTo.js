import React from 'react';

function HowTo(props) {
  return (
    <div>
      <h4>How To Play</h4>

      <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
    </div>
  );
}

export default HowTo;