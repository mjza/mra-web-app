import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useUser } from '../../../contexts/UserContext';
import LoadingOverlay from '../../ui/LoadingOverlay';
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
        const response = await fetch('https://auth.myreport.app/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        setLoading(false);

        if (response.status === 200) {
            login(data);
            navigate(redirect, { replace: true });
        } else {
            setError(data.message || 'Login failed, please try again.');
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
                                        <h1 className="display-6 text-primary">Welcome to your reporting assistant</h1>
                                        {error && <Alert variant="danger">{error}</Alert>}
                                        <Form.Group className="mb-3">
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
                                        <Form.Group className="mb-3">
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
                                        <LinkContainer to="/forgot-password">
                                            <Button variant="link">Forgot Password?</Button>
                                        </LinkContainer>
                                        <Button type="submit" disabled={loading} className="w-100 my-4">
                                            {loading ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                    &nbsp;Signing in...
                                                </>
                                            ) : "Sign In"}
                                        </Button>
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
