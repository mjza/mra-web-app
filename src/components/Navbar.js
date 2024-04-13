import React, { useState, useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import RCLogo from './RCLogo';
import { Navbar, Nav, Container, Form, FormControl, InputGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGifts, faCommentDots, faTicket, faHome, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import '../css/Navbar.scss';

const HeaderNavbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useContext(ThemeContext);
  const location = useLocation(); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(searchValue);
  };

  const isActive = (path) => location.pathname.startsWith(path);
  const activeLinkClass = `border-bottom border-3 ${theme === 'light' ? 'border-dark text-dark' : 'border-light text-light'}`;
  const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';
  const iconColor = theme === 'dark' ? '#F8F9FA' : '#212529';


  return (
    <>
      <Navbar expand="lg" className={`global-nav d-flex py-0 ${navbarClass}`}>
        <Container fluid className="d-flex align-items-center" style={{ flexWrap: 'nowrap' }}>
          <div className="flex-grow-0 d-none d-md-flex"></div>

          <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0">
            <Navbar.Brand href="/" className="d-flex align-items-center me-2">
              <RCLogo color={iconColor} size="50" />
            </Navbar.Brand>
            <Form className="d-flex ms-0 flex-grow-1 flex-md-grow-0" onSubmit={handleSearchSubmit}>
              <InputGroup className={`search-input-group ${isFocused ? 'input-group-focused' : ''}`}>
                <InputGroup.Text className='bg-transparent d-none d-md-inline-block'>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </InputGroup>
            </Form>
          </div>

          <div className="d-flex align-items-center">
            <Nav className="flex-row flex-grow-0 justify-content-end me-3 d-none d-md-flex">
              {[
                { href: "/feed", icon: faHome, text: "Home" },
                { href: "/tickets", icon: faTicket, text: "My Tickets" },
                { href: "/qrcodes", icon: faQrcode, text: "QR Codes" },
                { href: "/messaging", icon: faCommentDots, text: "Messaging" },
                { href: "/gifts", icon: faGifts, text: "Gifts" }
              ].map((link) => (
                <Nav.Link
                  key={link.text}
                  href={link.href}
                  className={`d-flex flex-column align-items-center text-center me-2 me-md-3 me-lg-4 ${isActive(link.href) ? activeLinkClass : ''}`}
                >
                  <OverlayTrigger
                    overlay={<Tooltip className='d-lg-none'>{link.text}</Tooltip>}
                    placement="bottom-start"
                    trigger={['hover', 'focus', 'click']}
                  >
                    <FontAwesomeIcon icon={link.icon} className="ms-md-2 me-md-2 fs-md-1 fs-lg-4" />
                  </OverlayTrigger>
                  <div className="d-none d-md-none d-lg-block" style={{ fontSize: '12px' }}>{link.text}</div>
                </Nav.Link>
              ))}
            </Nav>
            <Nav.Item>
              <img
                src="https://via.placeholder.com/40"
                className="d-inline-block align-top rounded-circle ms-2 ms-md-0"
                alt="User Avatar"
              />
            </Nav.Item>
          </div>
          <div className="flex-grow-0 d-none d-md-flex"></div>
        </Container>
      </Navbar>
    </>
  );
};

export default HeaderNavbar;
