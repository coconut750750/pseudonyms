import React, { useState, useCallback } from 'react';

import Toggle from '../input_components/Toggle';

import './DarkModeToggle.css';

export default function DarkModeToggle(props) {
  const [darkModeOn, setDarkModeOn] = useState(false);

  const toggleDarkMode = useCallback(() => {
    if (darkModeOn) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
    setDarkModeOn(!darkModeOn);
  }, [darkModeOn]);

  return (
    <div id="dark-mode-toggle">
      <Toggle onClick={toggleDarkMode}/>
    </div>
  );
}