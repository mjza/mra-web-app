import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import ThemeContext from '../../../contexts/ThemeContext.mjs';
import SignOut from '../../features/authentication/SignOut.mjs';
import ToggleThemeButton from '../../ui/ToggleThemeButton.mjs';
import './scss/SideNavigation.scss';

const SideNavigation = ({ isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const sideNavClass = theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark';

  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose}></div>}
      <div className={`side-navigation ${sideNavClass} ${isOpen ? 'open' : ''}`}>
        <div className="side-navigation-header">
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <ToggleThemeButton useIcons={true} fontSize={5} />
        </div>
        <hr className="m-0 p-0" />
        <div className="side-navigation-content">
          <nav>
            <ul>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/settings">Settings</a></li>
              <li><a href="/help">Help</a></li>
            </ul>
          </nav>
          <hr className="m-0 p-0" />
          <div className='p-3'>
            <SignOut />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavigation;
