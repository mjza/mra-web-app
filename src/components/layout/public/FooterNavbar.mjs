import { faNewspaper, faQrcode, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ThemeContext from '../../../contexts/ThemeContext.mjs';

const FooterNavbar = () => {
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
    const activeLinkClass = `border-top border-3 ${theme === 'light' ? 'border-dark text-dark' : 'border-light text-light'}`;
    const inactiveLinkClass = `border-top border-3 ${theme === 'dark' ? 'border-dark' : 'border-light'}`;
    const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';
    const bgColor = theme === 'light' ? 'white' : '';

    return (
        <Navbar bg={bgColor} fixed="bottom" className={`d-block d-md-none py-0 border-top ${navbarClass}`}>
            <Nav className="d-flex justify-content-around mw-100 text-center">
                {[
                    { href: "/news", icon: faNewspaper, text: "News" },
                    { href: "/tickets", icon: faTicket, text: "Tickets" },
                    { href: "/qrcodes", icon: faQrcode, text: "QR Codes" }
                ].map((link) => (
                    <Nav.Link href={link.href} key={link.text} className={`flex-grow-1 ${isActive(link.href) ? activeLinkClass : inactiveLinkClass}`}>
                        <FontAwesomeIcon icon={link.icon} className="fs-3" />
                        <div className="d-block" style={{ fontSize: '12px' }}>{link.text}</div>
                    </Nav.Link>
                ))}
            </Nav>
        </Navbar>
    );
};

export default FooterNavbar;
