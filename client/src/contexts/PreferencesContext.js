import React, { createContext, useState } from 'react';

export const PreferencesContext = createContext(undefined);

export function PreferencesContextProvider({ children }) {
  const [darkModeOn, setDarkModeOn] = useState((localStorage.getItem("dark") || 'false') === 'true');

  return (
    <PreferencesContext.Provider
      value={{
        darkModeOn, setDarkModeOn
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
