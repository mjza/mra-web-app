import React, { useContext } from 'react';
import ThemeContext from '../../contexts/ThemeContext.js';

const LoadingOverlay = () => {
    const { theme } = useContext(ThemeContext);

    // Determine background color based on the theme
    const backgroundColor = theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor, zIndex: 1050 }}>
            <div className="spinner-grow text-muted"></div>
            <div className="spinner-grow text-primary"></div>
            <div className="spinner-grow text-success"></div>
            <div className="spinner-grow text-info"></div>
            <div className="spinner-grow text-warning"></div>
            <div className="spinner-grow text-danger"></div>
            <div className="spinner-grow text-secondary"></div>
            <div className="spinner-grow text-dark"></div>
            <div className="spinner-grow text-light"></div>
        </div>
    );
};

export default LoadingOverlay;
