import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { getProfile } from '../api/auth';

const WithAuth = (WrappedComponent, redirect) =>
  function WithAuthComponent(props) {
    const [profile, setProfile] = useState(undefined);
    const history = useHistory();

    useEffect(() => {
      getProfile().then(res => {
        setProfile(res.user);
      }).catch(res => {
        history.push({ pathname: '/login', state: { redirect }});
      });
    }, [history]);

    return (
      <WrappedComponent {...props} profile={profile}/>
    );
  };

export default WithAuth;
