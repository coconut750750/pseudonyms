import React, { useRef } from 'react';
import { useHistory } from "react-router-dom";

import { forgotReturn } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';
import WithoutAuth from './WithoutAuth';

function ForgotPassword(props) {
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const history = useHistory();

  return (
    <form onSubmit={ (e) => {
        e.preventDefault();
        const password1 = passwordInputRef.current.value;
        const password2 = confirmPasswordInputRef.current.value;
        if (password1 !== password2) {
          props.setError("Passwords must match.");
        } else {
          forgotReturn(props.match.params.rtoken, password1)
            .then(r => history.push('/login'))
            .catch(r => props.setError(r.message))
        }
      } }>

      <h4>Enter a new password</h4>
      <input type="password" className="form-control" placeholder="Enter new password" ref={passwordInputRef}/>
      <br/>
      <input type="password" className="form-control" placeholder="Confirm new password" ref={confirmPasswordInputRef}/>
      <br/>

      <div className="button-row d-flex justify-content-around">
          <a href="/"><button type="button" className="btn btn-light">Cancel</button></a>
          <button type="submit" className="btn btn-light">Reset</button>
        </div>
  </form>

  );
}

export default WrappedMessage(WithoutAuth(ForgotPassword));