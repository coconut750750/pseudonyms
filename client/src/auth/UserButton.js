import React, { useState, useCallback } from 'react';

import { logout } from '../api/auth';

import './UserButton.css';

export default function UserButton(props) {
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
        <a href="/login" tabIndex="-1"><h6 className="menu">Login</h6></a>
      </div>
    );
  } else {
    return (
      <div className="user-btn">
        <div className="dropdown">
          <h6 className="menu" onClick={openMenu}>{props.username}</h6>
          <div className={`dropdown-content ${open ? "show" : "hide"}`}>
            <a href="/profile" tabIndex="-1">Profile</a>
            <a onClick={ () => logout() } href="/" tabIndex="-1">Logout</a>
          </div>
        </div>
      </div>
    );
  }
}