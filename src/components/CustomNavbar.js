import React from 'react';
import LogoComponent from './LogoComponent';
import { Navbar, Nav, Container, Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGifts, faCommentDots, faTicket, faNewspaper, faQrcode } from '@fortawesome/free-solid-svg-icons';

const CustomNavbar = () => {
  return (
    <>
      {/* Main Navbar for larger screens */}
      <Navbar bg="light" expand="lg" className="global-nav d-none d-lg-flex"> {/* Hide on screens smaller than lg */}
        <Container fluid className="d-flex align-items-center">
          {/* Placeholder for left-side white space */}
          <div className="flex-grow-1"></div>

          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <LogoComponent/>
            <Form className="d-flex ms-3">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
            </Form>
          </Navbar.Brand>
          
          <div className="d-flex align-items-center">
            {/* Dynamic whitespace can be managed with flex-grow */}
            <Nav className="flex-row flex-grow-1 justify-content-end me-3">
            <Nav.Link href="#news">
              <FontAwesomeIcon icon={faNewspaper} className="me-2" />
              News Feed
            </Nav.Link>
            <Nav.Link href="#tickets">
              <FontAwesomeIcon icon={faTicket} className="me-2" />
              My Tickets
            </Nav.Link>
            <Nav.Link href="#qrcodes">
              <FontAwesomeIcon icon={faQrcode} className="me-2" />
              QR Codes
            </Nav.Link>
            <Nav.Link href="#messaging">
              <FontAwesomeIcon icon={faCommentDots} className="me-2" />
              Messaging
            </Nav.Link>
            <Nav.Link href="#gifts">
              <FontAwesomeIcon icon={faGifts} className="me-2" />
              Gifts
            </Nav.Link>
            </Nav>
            {/* User Avatar */}
            <Nav.Item>
              <img
                src="https://via.placeholder.com/40"
                className="d-inline-block align-top"
                alt="User Avatar"
                style={{ borderRadius: '50%' }}
              />
            </Nav.Item>
          </div>

          {/* Placeholder for right-side white space */}
          <div className="flex-grow-1"></div>
        </Container>
      </Navbar>

      {/* Placeholder for alternative mobile Navbar */}
      {/* This would be your mobile-specific Navbar component or layout */}
      <div className="d-lg-none">
        {/* Mobile navbar components or simplified version here */}
      </div>
    </>
  );
};

export default CustomNavbar;
