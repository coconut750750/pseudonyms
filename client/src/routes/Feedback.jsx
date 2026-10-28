import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import { submitFeedback } from '../api/game';
import WrappedMessage from '../components/WrappedMessage';

function SubmitFeedback(props) {
  const textareaRef = useRef();

  const submit = (text) => {
    submitFeedback(textareaRef.current.value).then(() => {
      props.setSuccess("Successfully submitted!");
    }).catch((res) => {
      props.setError(res.message);
    }).finally(() => {
      textareaRef.current.value = "";
    });
  };

  return (
    <div className="skinny p-3">
      <h4>Submit Feedback</h4>

      <h6>Thanks for playing Pseudonyms!</h6>
      <h6>Please leave any comments, suggestions, or bugs below.</h6>

      <textarea className="form-control" ref={textareaRef} rows="5"></textarea>
      <br/>

      <div className="button-row d-flex justify-content-around">
        <Link className="btn" role="button" to="/">Back</Link>
        <button type="submit" className="btn" onClick={() => submit(textareaRef.current.value)}>Submit</button>
      </div>
    </div>
  );
}

export default WrappedMessage(SubmitFeedback);