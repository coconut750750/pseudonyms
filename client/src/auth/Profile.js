import React, { useRef } from 'react';

import { changePassword } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';
import WithAuth from './WithAuth';

function Profile(props) {
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  if (props.user !== undefined) {
    return (
      <div>
        <h4>{props.user?.username}</h4>
        <br/>        
        
        <h6>Ranking: {props.user.ranking}</h6>
        <h6>Total Games Played: {props.user.games}</h6>
        <h6>Wins: {props.user.wins}</h6>
        <br/>

        <h6>Email: {props.user.email}</h6>
        <h6>Created: {props.user.created}</h6>
        <br/>

        <h6>Change Password</h6>
        <form onSubmit={ (e) => {
            e.preventDefault();
            const password = passwordInputRef.current.value;
            const confirmed = confirmPasswordInputRef.current.value;
            if (password !== confirmed) {
              props.setError("Passwords must match.");
            } else {
              changePassword(password)
                .then(r => {
                  props.setSuccess("Successfully updated password.");
                  passwordInputRef.current.value = "";
                  confirmPasswordInputRef.current.value = "";
                })
                .catch(r => props.setError(r.message));
            }
          } }>

          <input type="password" className="form-control" placeholder="Enter password" ref={passwordInputRef}/>
          <br/>
          <input type="password" className="form-control" placeholder="Confirm password" ref={confirmPasswordInputRef}/>
          <br/>

          <div className="button-row d-flex justify-content-around">
            <button type="submit" className="btn btn-light">Submit</button>
          </div>
        </form>

      </div>
    );
  } else {
    return <div/>
  }
}

export default WrappedMessage(WithAuth(Profile));