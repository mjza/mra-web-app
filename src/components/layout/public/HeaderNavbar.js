import { faNewspaper, faQrcode, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Col, Container, Nav, Navbar, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeContext from '../../../contexts/ThemeContext.js';
import RCLogo from '../../common/RCLogo.js';
import ToggleThemeButton from '../../ui/ToggleThemeButton.js';

const HeaderNavbar = () => {
  const navigate = useNavigate();
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

  const { theme } = useContext(ThemeContext);
  const activeLinkClass = `border-bottom border-3 ${theme === 'light' ? 'border-dark text-dark' : 'border-light text-light'}`;
  const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';
  const iconColor = theme === 'dark' ? '#F8F9FA' : '#212529';
  const bgColor = theme === 'light' ? 'white' : '';

  return (
    <>
      <Navbar bg={bgColor} fixed="top" className={`global-nav py-0 ${navbarClass}`}>
        <Container fluid>
          <Row className="w-100 p-0 m-0">
            <Col xs={0} sm={1} md={1} lg={2} xl={2} xxl={3}></Col>
            <Col xs={12} sm={10} md={10} lg={8} xl={8} xxl={6} className='p-0 m-0'>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center flex-grow-1">
                  <Navbar.Brand href="/" className="me-2">
                    <RCLogo color={iconColor} size="50" />
                  </Navbar.Brand>
                  <ToggleThemeButton useIcons={true} fontSize={2}/>
                </div>

                <Nav className="flex-row justify-content-end me-2 d-none d-md-flex">
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
                        <FontAwesomeIcon icon={link.icon} className="ms-md-2 me-md-2 fs-md-3 fs-lg-4" />
                      </OverlayTrigger>
                      <div className="d-none d-md-block" style={{ fontSize: '12px' }}>{link.text}</div>
                    </Nav.Link>
                  ))}
                </Nav>

                <div className="mx-2 d-none d-md-flex">
                  <div className="vr fs-4">&nbsp;</div>
                </div>

                <Nav.Item>
                  <button type="button" className="btn btn-light mx-1" onClick={() => navigate('/signup')}>Sign up</button>
                  <button type="button" className="btn btn-primary mx-1" onClick={() => navigate('/signin')}>Sign in</button>
                </Nav.Item>
              </div>
            </Col>
            <Col xs={0} sm={1} md={1} lg={2} xl={2} xxl={3}></Col>
          </Row>
        </Container>
      </Navbar>
    </>
  );
};

export default HeaderNavbar;
