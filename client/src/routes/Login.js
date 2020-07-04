import React from 'react';
import sha256 from 'js-sha256';

import { login, register, secret, logout, changePassword } from '../api/auth';
import WrappedMessage from '../components/WrappedMessage';

function Login(props) {
  const checkResponse = res => {
    if (res.valid) {

    } else {
      props.setError(res.message);
    }
  }

  return (
    <form onSubmit={ (e) => {
        e.preventDefault();
        login("usernasme", sha256("newpass")).catch(r => props.setError("Incorrect username or password."));
      } }>
      <div>
          <label>Username:</label>
          <input type="text" name="username"/>
      </div>
      <div>
          <label>Password:</label>
          <input type="password" name="password"/>
      </div>
      <div>
          <button type="submit">Login</button>
      </div>

      <button type="button" onClick={ () => secret() }>secret</button>
      <button type="button" onClick={ () => logout() }>logout</button>
      <button type="button" onClick={ () => changePassword(sha256("newpass")) }>change</button>
      <button type="button" onClick={ () => register("usernasme", "email@me.com", sha256("passhash")).then(r => checkResponse(r)) }>register</button>
  </form>

  );
}

export default WrappedMessage(Login);