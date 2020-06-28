import React, { useState, useCallback, useRef } from 'react';
import debounce from "lodash/debounce";

import { submitFeedback } from '../api/game';

export default function SubmitFeedback(props) {
  const [message, setMessage] = useState(undefined);
  const debounceDisappear = () => setMessage(undefined);
  const disappearCallback = useCallback(debounce(debounceDisappear, 5000), []);
  const setDisappearingMessage = useCallback((string, cssClass) => {
    setMessage({ string, class: cssClass });
    disappearCallback();
  }, [disappearCallback]);

  const textareaRef = useRef();

  const submit = (text) => {
    submitFeedback(textareaRef.current.value).then(() => {
      setDisappearingMessage("Successfully submitted!", "alert-success");
    }).catch((res) => {
      setDisappearingMessage(res.message, "alert-danger");
    });
  };

  return (
    <div>
      <h4>Submit Feedback</h4>

      <h6>Thanks for checking out Pseudonyms!</h6>
      <h6>Please leave any comments, suggestions, or bugs below.</h6>

      <textarea className="form-control" ref={textareaRef} rows="5"></textarea>
      <br/>

      <div className="button-row d-flex justify-content-around">
        <a className="btn btn-light" role="button" href="/">Back</a>
        <button type="submit" className="btn btn-light" onClick={() => submit(textareaRef.current.value)}>Submit</button>
      </div>

      {message && <div className={`alert ${message.class} message`} role="alert">
        {message.string}
      </div>}
    </div>
  );
}
