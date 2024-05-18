import React, { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTicket, faQrcode, faCommentDots, faGifts } from '@fortawesome/free-solid-svg-icons';
import ThemeContext from '../../../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

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

    return (
        <Navbar fixed="bottom" className={`d-block d-md-none py-0 border-top  ${navbarClass}`}>
            <Nav className="d-flex justify-content-around w-100 text-center">
                {[
                    { href: "/feed", icon: faHome, text: "Home" },
                    { href: "/tickets", icon: faTicket, text: "My Tickets" },
                    { href: "/qrcodes", icon: faQrcode, text: "QR Codes" },
                    { href: "/messaging", icon: faCommentDots, text: "Messaging" },
                    { href: "/gifts", icon: faGifts, text: "Gifts" }
                ].map((link) => (
                    <Nav.Link href={link.href} key={link.text} className={`flex-grow-1 ${isActive(link.href) ? activeLinkClass : inactiveLinkClass}`}>
                        <FontAwesomeIcon icon={link.icon} className="fs-2" />
                        <div className="d-block text-truncate" style={{ fontSize: '12px' }}>{link.text}</div>
                    </Nav.Link>
                ))}
            </Nav>
        </Navbar>
    );
};

export default FooterNavbar;
