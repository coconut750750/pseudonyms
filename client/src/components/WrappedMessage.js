import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";

const WrappedMessage = WrappedComponent =>
  function Message(props) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const disappearTime = 5000;
    const debounceDisappear = () => {
      setError(null);
      setSuccess(null);
    };
    const disappearCallback = useCallback(
      debounce(debounceDisappear, disappearTime),
      []
    );

    const setErrorMessage = useCallback(message => {
      setSuccess(null);
      setError(message);
      disappearCallback();
    }, [disappearCallback]);

    const setSuccessMessage = useCallback(message => {
      setError(null);
      setSuccess(message);
      disappearCallback();
    }, [disappearCallback]);

    return (
      <div>
        <WrappedComponent
          {...props}
          setError={setErrorMessage}
          setSuccess={setSuccessMessage}
        />

        {success && <div className={`alert alert-success message`} role="alert">
          {success}
        </div>}
        {error && <div className={`alert alert-danger message`} role="alert">
          {error}
        </div>}
      </div>
    );
  };

export default WrappedMessage;
