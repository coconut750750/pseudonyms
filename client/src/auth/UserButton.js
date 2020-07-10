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
        <a href="/login"><h6 class="menu">Login</h6></a>
      </div>
    );
  } else {
    return (
      <div className="user-btn">
        <div class="dropdown">
          <h6 class="menu" onClick={openMenu}>{props.username}</h6>
          <div class={`dropdown-content ${open ? "show" : "hide"}`}>
            <a href="/profile">Profile</a>
            <a onClick={ () => logout() } href="/">Logout</a>
          </div>
        </div>
      </div>
    );
  }
}