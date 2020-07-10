import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { getProfile } from '../api/auth';

const WithAuth = (WrappedComponent, redirect) =>
  function WithAuthComponent(props) {
    const [user, setUser] = useState(undefined);
    const history = useHistory();

    useEffect(() => {
      getProfile().then(res => {
        setUser(res.user);
      }).catch(res => {
        history.push({ pathname: '/login', state: { redirect }});
      });
    }, [history]);

    return (
      <WrappedComponent {...props} user={user}/>
    );
  };

export default WithAuth;
