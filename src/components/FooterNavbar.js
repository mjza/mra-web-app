import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faQrcode, faCommentDots, faGifts } from '@fortawesome/free-solid-svg-icons';
import ThemeContext from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const FooterNavbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { theme } = useContext(ThemeContext);    
    const activeLinkClass = `border-top border-3 ${theme === 'light' ? 'border-dark text-dark' : 'border-light text-light'}`;
    const inactiveLinkClass = `border-top border-3 ${theme === 'dark' ? 'border-dark' : 'border-light'}`;
    const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';
    const bgColor = theme === 'light' ? 'white' : '';

    return (
        <Navbar bg={bgColor} fixed="bottom" className={`d-block d-md-none py-0 ${navbarClass}`}>
            <Container className="justify-content-around">
                <Nav className="w-100 text-center">
                    {[
                        { href: "/feed", icon: faHome, text: "Home" },
                        { href: "/tickets", icon: faTicket, text: "My Tickets" },
                        { href: "/qrcodes", icon: faQrcode, text: "QR Codes" },
                        { href: "/messaging", icon: faCommentDots, text: "Messaging" },
                        { href: "/gifts", icon: faGifts, text: "Gifts" }
                    ].map((link) => (
                        <Nav.Link href={link.href} key={link.text} className={`flex-grow-1 ${isActive(link.href) ? activeLinkClass : inactiveLinkClass}`}>
                            <FontAwesomeIcon icon={link.icon} className="fs-2" />
                            <div className="d-block" style={{ fontSize: '12px' }}>{link.text}</div>
                        </Nav.Link>
                    ))}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default FooterNavbar;
