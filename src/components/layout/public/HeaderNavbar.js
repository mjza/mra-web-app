import React, { useContext } from 'react';
import ThemeContext from '../../../contexts/ThemeContext';
import RCLogo from '../../common/RCLogo';
import { Navbar, Nav, Container, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faTicket, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

const HeaderNavbar = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const isActive = (path) => {
    const pathname = location.pathname;
    // Check if the path matches and the next character is "/", "?", or end of string
    if (!pathname.startsWith(path)) {
      return false;
    }
    const nextChar = pathname[path.length];
    return nextChar === '/' || nextChar === '?' || nextChar === undefined;
  };
  const activeLinkClass = `border-bottom border-3 ${theme === 'light' ? 'border-dark text-dark' : 'border-light text-light'}`;
  const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';
  const iconColor = theme === 'dark' ? '#F8F9FA' : '#212529';
  const bgColor = theme === 'light' ? 'white' : '';

  return (
    <>
      <Navbar bg={bgColor} expand="lg" className={`global-nav d-flex py-0 ${navbarClass}`}>
        <Container fluid className="d-flex flex-nowrap align-items-center">
          <div className="flex-grow-0 d-none d-md-flex"></div>

          <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0">
            <Navbar.Brand href="/" className="d-flex align-items-center me-2">
              <RCLogo color={iconColor} size="50" />
            </Navbar.Brand>
          </div>

          <div className="d-flex align-items-center">
            <Nav className="flex-row flex-grow-0 justify-content-end me-2 d-none d-md-flex">
              {[
                { href: "/news", icon: faNewspaper, text: "News" },
                { href: "/tickets", icon: faTicket, text: "Tickets" },
                { href: "/qrcodes", icon: faQrcode, text: "QR Codes" }
              ].map((link) => (
                <Nav.Link
                  key={link.text}
                  href={link.href}
                  className={`d-flex flex-column align-items-center text-center ms-2 ms-md-3 ms-lg-4 ${isActive(link.href) ? activeLinkClass : ''}`}
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
            <div className="d-flex flex-column align-items-center mx-2">              
              <div className="vr fs-4">&nbsp;</div>
            </div>

            <Nav.Item>
              <button type="button" className="btn btn-light ms-2 me-2">Sign up</button>
              <button type="button" className="btn btn-primary ms-2 me-2">Sign in</button>
            </Nav.Item>
          </div>
          <div className="flex-grow-0 d-none d-md-flex"></div>
        </Container>
      </Navbar>
    </>
  );
};

export default HeaderNavbar;
