import React, { useState, useEffect } from 'react';

import Toggle from '../input_components/Toggle';

import './DarkModeToggle.css';

export default function DarkModeToggle(props) {
  const [darkModeOn, setDarkModeOn] = useState((localStorage.getItem("dark") || 'false') === 'true');

  useEffect(() => {
    localStorage.setItem("dark", darkModeOn);
    if (darkModeOn) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkModeOn]);

  return (
    <div id="dark-mode-toggle">
      <Toggle
        onClick={() => setDarkModeOn(!darkModeOn)}
        clicked={darkModeOn}/>
    </div>
  );
}