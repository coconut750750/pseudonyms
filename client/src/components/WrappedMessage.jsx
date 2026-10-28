import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";

import './WrappedMessage.css';

const WrappedMessage = WrappedComponent =>
  function Message(props) {
    const [message, setMessage] = useState(undefined);
    const [messageClass, setMessageClass] = useState(undefined);

    const disappearTime = 2000;
    const debounceDisappear = () => {
      setMessage(undefined);
      setMessageClass(undefined);
    };
    const disappearCallback = useCallback(
      debounce(debounceDisappear, disappearTime),
      []
    );

    const setErrorMessage = useCallback(message => {
      setMessage(message);
      setMessageClass("alert-danger");
      disappearCallback();
    }, [disappearCallback]);

    const setSuccessMessage = useCallback(message => {
      setMessage(message);
      setMessageClass("alert-success");
      disappearCallback();
    }, [disappearCallback]);

    return (
      <div className="wrapped-message">
        <WrappedComponent
          {...props}
          setError={setErrorMessage}
          setSuccess={setSuccessMessage}
        />

        <div className="message-wrapper" onClick={ () => debounceDisappear() }>
          {message && <div className={`alert ${messageClass} message`} role="alert">
            {message}
          </div>}
        </div>
      </div>
    );
  };

export default WrappedMessage;
