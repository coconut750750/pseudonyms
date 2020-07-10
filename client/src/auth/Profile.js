import React from 'react';

import { changePassword } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';
import DoublePassword from './DoublePassword';
import WithAuth from './WithAuth';

function Profile(props) {
  if (props.profile === undefined) {
    return <div/>;
  }
  return (
    <div>
      <h4>{props.profile?.username}</h4>
      <br/>        
      
      <h6>Ranking: {props.profile.ranking}</h6>
      <h6>Total Games Played: {props.profile.games}</h6>
      <h6>Wins: {props.profile.wins}</h6>
      <br/>

      <h6>Email: {props.profile.email}</h6>
      <h6>Age: {props.profile.age}</h6>
      <br/>

      <h6>Change Password</h6>
      <DoublePassword
        setError={props.setError}
        submit={ password => {
          changePassword(password)
            .then(r => {
              props.setSuccess("Successfully updated password.");
            })
            .catch(r => props.setError(r.message));
        }}
        belowPassword={
          <div className="button-row d-flex justify-content-around">
            <button type="submit" className="btn btn-light">Submit</button>
          </div>
        }
      />
    </div>
  );
}

export default WrappedMessage(WithAuth(Profile, '/profile'));