import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useUser } from '../../../contexts/UserContext';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { loginService } from '../../../services/auth';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import AdvertisementCarousel from '../../common/AdvertisementCarousel';

const SignIn = () => {
    const { login } = useUser();
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect') || '/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { success, message, data } = await loginService(credentials.usernameOrEmail, credentials.password);
        setLoading(false);
        if (success) {
            login(data);
            navigate(redirect, { replace: true });
        } else {
            setError(message);
        }
    };

    return (
        <>
            <div className="min-vh-100 align-items-center py-5">
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={2} xxl={3}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={8} xxl={6} className='px-0 pt-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container>
                            <Row>
                                {/* Form Column */}
                                <Col sm={12} md={6} className="d-flex flex-column justify-content-center align-items-center">
                                    <Form onSubmit={handleSubmit} className="w-100">
                                        <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Welcome to your reporting assistant</h1>
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <Form.Group className="mb-2 mb-xxxl-4">
                                            <Form.Label>Username or Email:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="usernameOrEmail"
                                                value={credentials.usernameOrEmail}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3 mb-xxxl-4">
                                            <Form.Label>Password:</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={credentials.password}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                        <Button type="submit" disabled={loading} className="text-nowrap overflow-hidden w-100 mt-2 mb-4 mb-xxxl-5">
                                            {loading ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                    &nbsp;Signing in...
                                                </>
                                            ) : "Sign In"}
                                        </Button>
                                        <div class="d-flex flex-column flex-md-row justify-content-between">
                                            <LinkContainer to="/forgot-password">
                                                <Button variant="warning" className="text-nowrap overflow-hidden w-lg-48 w-xxxl-45 mb-4 mb-md-0 ">Forgot Password?</Button>
                                            </LinkContainer>
                                            <LinkContainer to="/signup">
                                                <Button variant="success" className="text-nowrap overflow-hidden w-lg-48 w-xxxl-45">Have no account?</Button>
                                            </LinkContainer>
                                        </div>
                                    </Form>
                                </Col>
                                {/* Image Column */}
                                <Col sm={12} md={6} className="pe-md-0">
                                    <img
                                        src="/images/banner0.webp"
                                        alt="A graph that explains the main functionality of the application."
                                        className="py-3 img-fluid"
                                        style={{
                                            borderRadius: '20%',  // top-right, bottom-right, bottom-left, top-left

                                        }}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={2} xl={2} xxl={3}></Col> {/* Right gap */}
                </Row>
                <div className="w-100 p-0 m-0 feature-box">
                    <AdvertisementCarousel />
                </div>
            </div>
        </>
    );
};

export default SignIn;
