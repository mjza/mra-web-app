import React, { useContext } from 'react';
import ThemeContext from '../../../contexts/ThemeContext';
import SignOut from '../../features/authentication/SignOut';
import ToggleThemeButton from '../../ui/ToggleThemeButton';
import './scss/SideNavigation.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
