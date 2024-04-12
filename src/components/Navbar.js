import React, { useState } from 'react';
import RCLogo from './RCLogo';
import { Navbar, Nav, Container, Form, FormControl, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGifts, faCommentDots, faTicket, faHome, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';  // Import useLocation

const HeaderNavbar = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Log the current state of the search input
    console.log(searchValue);
  };

  const location = useLocation();  // Get the current location

  // Function to determine if the current path matches the Nav.Link href
  const isActive = (path) => location.pathname.startsWith(path);

  // Add the class for border-bottom thick and color
  const activeLinkClass = "border-bottom border-3 border-dark text-dark";

  return (
    <>
      <Navbar bg="light" expand="lg" className="global-nav d-none d-lg-flex">
        <Container fluid className="d-flex align-items-center">
          <div className="flex-grow-0"></div>

          <div className="d-flex align-items-center">
            <Navbar.Brand href="/" className="d-flex align-items-center">
              <RCLogo color="#282c34" size="50" />
            </Navbar.Brand>
            <Form className="d-flex ms-0" onSubmit={handleSearchSubmit}>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-6"
                  aria-label="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </InputGroup>
            </Form>
          </div>

          <div className="d-flex align-items-center">
            <Nav className="flex-row flex-grow-0 justify-content-end me-3">
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
                  className={`d-flex flex-column align-items-center text-center ${isActive(link.href) ? activeLinkClass : ''}`}
                >
                  <FontAwesomeIcon icon={link.icon} className="ms-md-2 me-md-2 fs-4" />
                  <div style={{ fontSize: '12px' }}>{link.text}</div>
                </Nav.Link>
              ))}
            </Nav>
            <Nav.Item>
              <img
                src="https://via.placeholder.com/40"
                className="d-inline-block align-top"
                alt="User Avatar"
                style={{ borderRadius: '50%' }}
              />
            </Nav.Item>
          </div>
          <div className="flex-grow-0"></div>
        </Container>
      </Navbar>
      <div className="d-lg-none">
        {/* Mobile navbar components */}
      </div>
    </>
  );
};

export default HeaderNavbar;
