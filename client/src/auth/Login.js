import React, { useRef } from 'react';
import { Link } from "react-router-dom";

import { useAuth } from "./useAuth.js";

import WrappedMessage from '../components/WrappedMessage';
import WithoutAuth from './WithoutAuth';

function Login(props) {
  const auth = useAuth();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  return (
    <div>
      <h4>Login</h4>
      
      <form onSubmit={ (e) => {
          e.preventDefault();
          const redirect = props.location?.state?.redirect || '/';
          props.setRedirect(redirect);

          auth.login(usernameInputRef.current.value, passwordInputRef.current.value)
            .then(r => {})
            .catch(r => props.setError("Incorrect username or password."));
        } }>

        <input type="name" className="form-control" placeholder="Enter username" ref={usernameInputRef}/>
        <br/>
        <input type="password" className="form-control" placeholder="Enter password" ref={passwordInputRef}/>
        <Link to="/forgot"><h6 className="text-right mt-1">Forgot password?</h6></Link>
        <br/>

        <div className="button-row d-flex justify-content-around">
          <Link to="/"><button type="button" className="btn btn-light">Home</button></Link>
          <button type="submit" className="btn btn-light">Login</button>
        </div>

        <Link to={{
          pathname: '/register',
          state: { redirect: props.location?.state?.redirect }
        }}><h6 className="mt-1">New account?</h6></Link>

      </form>
    </div>

  );
}

export default WrappedMessage(WithoutAuth(Login));