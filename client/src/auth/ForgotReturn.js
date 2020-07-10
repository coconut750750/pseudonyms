import React from 'react';
import { useHistory, Link } from "react-router-dom";

import { forgotReturn } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';
import DoublePassword from './DoublePassword';
import WithoutAuth from './WithoutAuth';

function ForgotPassword(props) {
  const history = useHistory();

  return (
    <DoublePassword
      setError={props.setError}
      submit={ password => {
        forgotReturn(props.match.params.rtoken, password)
          .then(r => history.push('/login'))
          .catch(r => props.setError(r.message))
      }}
      abovePassword={<h4>Enter a new password</h4>}
      belowPassword={
        <div className="button-row d-flex justify-content-around">
          <Link to="/"><button type="button" className="btn btn-light">Cancel</button></Link>
          <button type="submit" className="btn btn-light">Reset</button>
        </div>
      }
    />
  );
}

export default WrappedMessage(WithoutAuth(ForgotPassword));