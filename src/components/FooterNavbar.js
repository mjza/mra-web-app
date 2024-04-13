import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faQrcode, faCommentDots, faGifts } from '@fortawesome/free-solid-svg-icons';
import ThemeContext from '../contexts/ThemeContext';

const FooterNavbar = () => {
    const { theme } = useContext(ThemeContext);
    const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';
    const bgColor = theme === 'light' ? 'white' : '';

    return (
        <Navbar bg={bgColor} fixed="bottom" className={`d-block d-md-none ${navbarClass}`}>
            <Container className="justify-content-around">
                <Nav className="w-100 text-center">
                    {[
                        { href: "/feed", icon: faHome, text: "Home" },
                        { href: "/tickets", icon: faTicket, text: "My Tickets" },
                        { href: "/qrcodes", icon: faQrcode, text: "QR Codes" },
                        { href: "/messaging", icon: faCommentDots, text: "Messaging" },
                        { href: "/gifts", icon: faGifts, text: "Gifts" }
                    ].map((link) => (
                        <Nav.Link href={link.href} key={link.text} className="flex-grow-1">
                            <FontAwesomeIcon icon={link.icon} className="fs-4" />
                            <div className="d-block" style={{ fontSize: '12px' }}>{link.text}</div>
                        </Nav.Link>
                    ))}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default FooterNavbar;
