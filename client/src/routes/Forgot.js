import React, { useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { forgotPassword, getUser } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';

function ForgotPassword(props) {
  const emailInputRef = useRef();
  const history = useHistory();

  useEffect(() => {
    getUser().then(res => {
      if (res.username !== undefined) {
        history.push('/')
      }
    }).catch(res => {});
  }, [history]);

  return (
    <div>
      <h4>Forgot Password</h4>
      <h6>If your email exists, a password reset link will be sent to it (check your spam folder).</h6>
      
      <form onSubmit={ (e) => {
          e.preventDefault();
          forgotPassword(emailInputRef.current.value)
            .then(r => history.push('/'));
        } }>

        <input type="name" className="form-control" placeholder="Enter email" ref={emailInputRef}/>
        <br/>

        <div className="button-row d-flex justify-content-around">
          <a href="/"><button type="button" className="btn btn-light">Back</button></a>
          <button type="submit" className="btn btn-light">Send</button>
        </div>
      </form>
    </div>

  );
}

export default WrappedMessage(ForgotPassword);