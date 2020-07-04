import React, { useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { getUser, register } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';

function Register(props) {
  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const history = useHistory();

  useEffect(() => {
    getUser().then(res => {
      if (res.username !== undefined) {
        history.push('/')
      }
    });
  });

  return (
    <div>
      <h4>Register</h4>
      
      <form onSubmit={ (e) => {
          e.preventDefault();
          const password1 = passwordInputRef.current.value;
          const password2 = confirmPasswordInputRef.current.value;
          if (password1 !== password2) {
            props.setError("Passwords must match.");
          } else {
            register(usernameInputRef.current.value, emailInputRef.current.value, password1)
              .then(r => {
                if (r.valid) {
                  history.push('/')
                } else {
                  props.setError(r.message);
                }
              })
          }
        } }>

        <input type="name" className="form-control" placeholder="Enter username" ref={usernameInputRef}/>
        <br/>
        <input type="name" className="form-control" placeholder="Enter email" ref={emailInputRef}/>
        <br/>
        <input type="password" className="form-control" placeholder="Enter password" ref={passwordInputRef}/>
        <br/>
        <input type="password" className="form-control" placeholder="Confirm password" ref={confirmPasswordInputRef}/>
        <br/>

        <div className="button-row d-flex justify-content-around">
          <a href="/"><button type="button" className="btn btn-light">Back</button></a>
          <button type="submit" className="btn btn-light">Register</button>
        </div>
      </form>
    </div>

  );
}

export default WrappedMessage(Register);