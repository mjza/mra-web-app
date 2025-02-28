import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import ThemeContext from '../../contexts/ThemeContext.mjs';

function ToggleThemeButton({ useIcons = false, fontSize = 1 }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDarkTheme = theme === 'dark';

  const handleChange = () => {
    setTheme(isDarkTheme ? 'light' : 'dark');
  };

  return (
    <div className="d-flex align-items-center">
      <div className="me-2">{ // This div will hold the label or icon
        useIcons ? (
          isDarkTheme ? <FontAwesomeIcon className={`fs-${fontSize}`} icon={faMoon} /> : <FontAwesomeIcon className={`fs-${fontSize}`} icon={faSun} />
        ) : (
          `Dark Theme: ${isDarkTheme ? "ON" : "OFF"}`
        )
      }</div>
      <Form.Check 
        type="switch"
        id="theme-switch"
        checked={isDarkTheme}
        onChange={handleChange}
        className="ps-5"
        style={{ width: 'fit-content' }} // Ensures the switch does not stretch
      />
    </div>
  );
}

export default ToggleThemeButton;
