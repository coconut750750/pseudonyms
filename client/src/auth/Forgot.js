import React, { useRef } from 'react';
import { useHistory, Link } from "react-router-dom";

import { forgotPassword } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';
import WithoutAuth from './WithoutAuth';

function ForgotPassword(props) {
  const emailInputRef = useRef();
  const history = useHistory();

  return (
    <div>
      <h4>Forgot Password</h4>
      <h6>A password reset link will be sent to your email if an account is associated with it.</h6>
      <h6>You may need to check your spam folder.</h6>
      
      <form onSubmit={ (e) => {
          e.preventDefault();
          forgotPassword(emailInputRef.current.value)
            .then(r => history.push('/'))
            .catch(r => props.setError(r.message));
        } }>

        <input type="name" className="form-control" placeholder="Enter email" ref={emailInputRef}/>
        <br/>

        <div className="button-row d-flex justify-content-around">
          <Link to="/login"><button type="button" className="btn btn-light">Back</button></Link>
          <button type="submit" className="btn btn-light">Send</button>
        </div>
      </form>
    </div>

  );
}

export default WrappedMessage(WithoutAuth(ForgotPassword));