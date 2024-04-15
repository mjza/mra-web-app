import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-transparent w-100 py-3 mb-5 mb-md-0">
            <Container>
                <Row>
                    <Col className="d-flex flex-column flex-sm-row justify-content-center">
                        <Nav className="flex-row justify-content-center">
                            <Nav.Link href="https://reportcycle.com" className="text-muted">
                            ReportCycle &copy; 2023-{currentYear} 
                            </Nav.Link>
                            <Nav.Link href="https://about.myreportapp.com" className="text-muted">About</Nav.Link>
                            <Nav.Link href="https://accessibility.myreportapp.com" className="text-muted">Accessibility</Nav.Link>
                            <Nav.Link href="https://user-agreement.myreportapp.com" className="text-muted">User Agreement</Nav.Link>
                            <Nav.Link href="https://privacy.myreportapp.com" className="text-muted">Privacy Policy</Nav.Link>
                            <Nav.Link href="https://cookie-policy.myreportapp.com" className="text-muted">Cookie Policy</Nav.Link>
                            <Nav.Link href="https://copyright.myreportapp.com" className="text-muted">Copyright Policy</Nav.Link>
                            <Nav.Link href="https://brand.myreportapp.com" className="text-muted">Brand Policy</Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
