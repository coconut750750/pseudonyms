import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from "react-router-dom";

import { getProfile, changePassword } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';

function Profile(props) {
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const [user, setUser] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    getProfile().then(res => {
      if (res.user === undefined) {
        history.push('/login')
      } else {
        setUser(res.user);
      }
    }).catch(res => {});
  }, [history]);

  if (user !== undefined) {
    return (
      <div>
        <h4>{user?.username}</h4>
        <br/>        
        
        <h6>Ranking: {user.ranking}</h6>
        <h6>Total Games Played: {user.games}</h6>
        <h6>Wins: {user.wins}</h6>
        <br/>

        <h6>Email: {user.email}</h6>
        <h6>Created: {user.created}</h6>
        <br/>

        <h6>Change Password</h6>
        <form onSubmit={ (e) => {
            e.preventDefault();
            const password1 = passwordInputRef.current.value;
            const password2 = confirmPasswordInputRef.current.value;
            if (password1 !== password2) {
              props.setError("Passwords must match.");
            } else {
              changePassword(password1)
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
            <button type="submit" className="btn btn-light">Update Password</button>
          </div>
        </form>

      </div>
    );
  } else {
    return <div/>
  }
}

export default WrappedMessage(Profile);