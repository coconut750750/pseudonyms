import React, { useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { login, getUser } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';

function Login(props) {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
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
      <h4>Login</h4>
      
      <form onSubmit={ (e) => {
          e.preventDefault();
          login(usernameInputRef.current.value, passwordInputRef.current.value)
            .then(r => history.push('/'))
            .catch(r => props.setError("Incorrect username or password."));
        } }>

        <input type="name" className="form-control" placeholder="Enter username" ref={usernameInputRef}/>
        <br/>
        <input type="password" className="form-control" placeholder="Enter password" ref={passwordInputRef}/>
        <br/>

        <div className="button-row d-flex justify-content-around">
          <a href="/"><button type="button" className="btn btn-light">Back</button></a>
          <button type="submit" className="btn btn-light">Login</button>
        </div>
      </form>
    </div>

  );
}

export default WrappedMessage(Login);