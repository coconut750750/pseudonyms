import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "./useAuth.js";

const WithoutAuth = WrappedComponent =>
  function WithoutAuthComponent(props) {
    const auth = useAuth();
    const history = useHistory();
    const [redirect, setRedirect] = useState('/');

    useEffect(() => {
      if (auth.user !== undefined) {
        history.push(redirect)
      }
    }, [auth, history, redirect]);

    return (
      <WrappedComponent
        setRedirect={setRedirect}
        {...props}/>
    );
  };

export default WithoutAuth;
