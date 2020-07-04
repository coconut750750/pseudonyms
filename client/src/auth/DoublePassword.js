import React, { useRef } from 'react';

export default function DoublePassword(props) {
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  return (
    <form onSubmit={ (e) => {
        e.preventDefault();
        const password = passwordInputRef.current.value;
        const confirmed = confirmPasswordInputRef.current.value;
        if (password !== confirmed) {
          props.setError("Passwords must match.");
        } else {
          passwordInputRef.current.value = "";
          confirmPasswordInputRef.current.value = "";
          props.submit(password);
        }
      } }>

      {props.abovePassword}

      <input type="password" className="form-control" placeholder="Enter password" ref={passwordInputRef}/>
      <br/>
      <input type="password" className="form-control" placeholder="Confirm password" ref={confirmPasswordInputRef}/>
      <br/>

      {props.belowPassword}
    </form>
  );
}