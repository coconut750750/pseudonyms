import React, { useRef } from 'react';
import { useHistory } from "react-router-dom";

import { register } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';
import WithoutAuth from './WithoutAuth';

function Register(props) {
  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const history = useHistory();

  return (
    <div>
      <h4>Register</h4>
      
      <form onSubmit={ (e) => {
          e.preventDefault();
          const password = passwordInputRef.current.value;
          const confirmed = confirmPasswordInputRef.current.value;
          if (password !== confirmed) {
            props.setError("Passwords must match.");
          } else {
            register(usernameInputRef.current.value, emailInputRef.current.value, password)
              .then(r => history.push('/'))
              .catch(r => props.setError(r.message));
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

export default WrappedMessage(WithoutAuth(Register));