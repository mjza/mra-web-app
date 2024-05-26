import React, { useState, useContext } from 'react';
import ThemeContext from '../../../contexts/ThemeContext';
import RCLogo from '../../common/RCLogo';
import SideNavigation from './SideNavigation';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGifts, faCommentDots, faTicket, faHome, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import './scss/Navbar.scss';

const HeaderNavbar = () => {
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
                <div className="d-flex align-items-center flex-grow-1">
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
                  <OverlayTrigger
                    overlay={<Tooltip>Profile</Tooltip>}
                    placement="bottom"
                  >
                    <img
                      src="https://via.placeholder.com/40"
                      className="d-inline-block align-top rounded-circle ms-2 ms-md-0 avatar"
                      alt="User Avatar"
                      onClick={() => setIsNavOpen(true)}
                    />
                  </OverlayTrigger>
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
