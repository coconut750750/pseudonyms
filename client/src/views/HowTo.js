import React from 'react';

function HowTo(props) {
  return (
    <div>
      <h5>How To Play</h5>

      <button type="button" className="btn btn-light" onClick={props.goBack}>Back</button>
    </div>
  );
}

export default HowTo;