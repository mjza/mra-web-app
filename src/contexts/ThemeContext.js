import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize the theme state based on the value stored in local storage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    // Attempt to get the theme from local storage
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'dark'; // Return the stored theme or default to 'dark' if none is found
  });

  useEffect(() => {
    // Update the body class and local storage whenever the theme changes
    document.body.className = theme;
    localStorage.setItem('theme', theme); // Store the theme in local storage
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
