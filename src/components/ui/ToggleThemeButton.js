import React, { useContext } from 'react';
import ThemeContext from '../../contexts/ThemeContext';

function ToggleThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}

export default ToggleThemeButton;
