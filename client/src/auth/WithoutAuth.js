import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { getUser } from '../api/auth';

const WithoutAuth = WrappedComponent =>
  function WithoutAuthComponent(props) {
    const history = useHistory();

    useEffect(() => {
      getUser().then(res => {
        if (res.username !== undefined) {
          history.push('/')
        }
      }).catch(res => {});
    }, [history]);

    return (
      <WrappedComponent {...props}/>
    );
  };

export default WithoutAuth;
