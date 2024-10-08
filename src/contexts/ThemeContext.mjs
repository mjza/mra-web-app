import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize the theme state based on the value stored in local storage or default to 'light'
  const [theme, setTheme] = useState(() => {
    // Attempt to get the theme from local storage
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'light'; // Return the stored theme or default to 'light' if none is found
  });

  useEffect(() => {
    // Update the body class and local storage whenever the theme changes
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
