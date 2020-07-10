import React, { useState, useEffect, useContext, createContext } from "react";
import * as auth from '../api/auth';

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(undefined);
  
  const login = (username, password) => {
    return auth.login(username, password).then(res => setUser(res.user));
  };

  const register = (username, email, password) => {
    return auth.register(username, email, password).then(res => setUser(res.user));
  };

  const logout = () => {
    return auth.logout().then(res => setUser(undefined));
  };

  useEffect(() => {
    console.log('here')
    auth.getUser().then(res => {
      setUser(res.user);
    }).catch(res => {
      setUser(undefined);
    });
  }, []);
  
  return {
    user,
    login,
    register,
    logout,
  };
}