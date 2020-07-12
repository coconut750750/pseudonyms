import React, { useState, useCallback } from 'react';
import { Link } from "react-router-dom";

import { useAuth } from "./useAuth.js";

import './UserButton.css';

export default function UserButton(props) {
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setOpen(false);
    document.removeEventListener('click', closeMenu);
  }, []);

  const openMenu = useCallback(() => {
    setOpen(true);
    document.addEventListener('click', closeMenu);
  }, [closeMenu]);


  if (props.username === undefined) {
    return (
      <div className="user-btn">
        <Link to="/login" tabIndex="-1"><h6 className="menu">Login</h6></Link>
      </div>
    );
  } else {
    return (
      <div className="user-btn">
        <div className="dropdown">
          <h6 className="menu" onClick={openMenu}>{props.username}</h6>
          <div className={`dropdown-content ${open ? "show" : "hide"}`}>
            <Link to="/profile" tabIndex="-1">Profile</Link>
            <a onClick={ () => auth.logout() } href="/" tabIndex="-1">Logout</a>
          </div>
        </div>
      </div>
    );
  }
}