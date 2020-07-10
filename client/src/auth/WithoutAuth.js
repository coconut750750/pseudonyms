import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "./useAuth.js";

const WithoutAuth = WrappedComponent =>
  function WithoutAuthComponent(props) {
    const auth = useAuth();
    const history = useHistory();

    useEffect(() => {
      if (auth.user !== undefined) {
        history.push('/')
      }
    }, [auth, history]);

    return (
      <WrappedComponent {...props}/>
    );
  };

export default WithoutAuth;
