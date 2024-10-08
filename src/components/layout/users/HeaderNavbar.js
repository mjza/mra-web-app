import { faCommentDots, faGifts, faHome, faQrcode, faSearch, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { Col, Container, Form, FormControl, InputGroup, Nav, Navbar, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ThemeContext from '../../../contexts/ThemeContext.js';
import { useUser } from '../../../contexts/UserContext.js';
import RCLogo from '../../common/RCLogo.js';
import './scss/Navbar.scss';
import SideNavigation from './SideNavigation.js';

const HeaderNavbar = () => {
  const { user } = useUser();
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(searchValue);
  };

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

  return (
    <>
      <Navbar fixed="top" className={`global-nav py-0 border-bottom ${navbarClass}`}>
        <Container fluid>
          <Row className="w-100 p-0 m-0">
            <Col xs={0} sm={1} md={1} lg={2} xl={2} xxl={3}></Col>
            <Col xs={12} sm={10} md={10} lg={8} xl={8} xxl={6} className='p-0 m-0'>
              <div className="d-flex align-items-sm-center align-items-md-end justify-content-between">
                <div className="d-flex align-items-center flex-grow-1 my-auto">
                  <Navbar.Brand href="/" className="me-2">
                    <RCLogo color={iconColor} size="50" />
                  </Navbar.Brand>
                  <Form className="d-flex flex-grow-1 flex-md-grow-0 ms-2" onSubmit={handleSearchSubmit}>
                    <InputGroup className={`search-input-group ${isFocused ? 'input-group-focused' : ''}`}>
                      <InputGroup.Text className='bg-transparent d-none d-md-inline-block'>
                        <FontAwesomeIcon icon={faSearch} />
                      </InputGroup.Text>
                      <FormControl
                        type="search"
                        name="search"
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
                  <Nav className="flex-row justify-content-end me-1 d-none d-md-flex">
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
                        className={`d-flex flex-column align-items-center text-center me-2 ${isActive(link.href) ? activeLinkClass : ''}`}
                      >
                        <OverlayTrigger
                          overlay={<Tooltip className='d-lg-none'>{link.text}</Tooltip>}
                          placement="bottom-start"
                          trigger={['hover', 'focus', 'click']}
                        >
                          <FontAwesomeIcon icon={link.icon} className="mx-2 fs-md-2 fs-lg-4" />
                        </OverlayTrigger>
                        <div className="d-none d-md-none d-lg-block text-truncate" style={{ fontSize: '12px' }}>{link.text}</div>
                      </Nav.Link>
                    ))}
                  </Nav>
                  <img
                    src={user.profilePictureBase64}
                    role="button"
                    className="d-inline-block align-top rounded-circle ms-2 ms-md-0 avatar"
                    style={{ width: '40px', height: '40px' }}
                    alt="User Avatar"
                    onClick={() => setIsNavOpen(true)}
                  />
                </div>
              </div>
            </Col>
            <Col xs={0} sm={1} md={1} lg={2} xl={2} xxl={3}></Col>
          </Row>
        </Container>
      </Navbar>
      <SideNavigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </>
  );
};

export default HeaderNavbar;
