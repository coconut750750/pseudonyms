import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { getProfile } from '../api/auth';

const WithAuth = WrappedComponent =>
  function WithAuthComponent(props) {
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

    return (
      <WrappedComponent {...props} user={user}/>
    );
  };

export default WithAuth;
