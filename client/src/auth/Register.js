import React, { useRef } from 'react';
import { useHistory } from "react-router-dom";

import { register } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';
import DoublePassword from './DoublePassword';
import WithoutAuth from './WithoutAuth';

function Register(props) {
  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const history = useHistory();

  return (
    <div>
      <h4>Register</h4>
      
      <DoublePassword
        setError={props.setError}
        submit={ password => {
          register(usernameInputRef.current.value, emailInputRef.current.value, password)
            .then(r => history.push('/'))
            .catch(r => props.setError(r.message));
        }}
        abovePassword={
          <div>
            <input type="name" className="form-control" placeholder="Enter username" ref={usernameInputRef}/>
            <br/>
            <input type="name" className="form-control" placeholder="Enter email" ref={emailInputRef}/>
            <br/>
          </div>
        }
        belowPassword={
          <div className="button-row d-flex justify-content-around">
            <a href="/"><button type="button" className="btn btn-light">Back</button></a>
            <button type="submit" className="btn btn-light">Register</button>
          </div>
        }
      />
    </div>

  );
}

export default WrappedMessage(WithoutAuth(Register));