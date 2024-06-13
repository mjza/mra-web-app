import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useUser } from '../../../contexts/UserContext';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { loginService } from '../../../services/auth';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import AdvertisementCarousel from '../../common/AdvertisementCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState('/');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const redirect = searchParams.get('redirect');
        if (redirect && redirect.trim().length > 0) {
            setRedirect(redirect);
        }
        const username = searchParams.get('username') || '';
        if (username) {
            setCredentials(currentCredentials => ({
                ...currentCredentials,
                usernameOrEmail: username
            }));
        }
    }, [location.search]);

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
            await login(data, rememberMe);
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
                    <Col xs={10} sm={10} md={10} lg={8} xl={8} xxl={6} className='px-0 py-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container>
                            <Row>
                                {/* Form Column */}
                                <Col sm={12} md={6} className="d-flex flex-column justify-content-center align-items-center">
                                    <Form onSubmit={handleSubmit} className="w-100">
                                        <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Welcome to your reporting assistant</h1>
                                        {error &&
                                            <Alert variant="danger">
                                                <b>Errors:</b><br />
                                                {error.split('\n').map((line, index) => (
                                                    <React.Fragment key={index}>
                                                        {line}
                                                        <br />
                                                    </React.Fragment>
                                                ))}
                                            </Alert>}
                                        <Form.Group>
                                            <Form.Label className="w-100">Username or Email:
                                                <Form.Control
                                                    type="text"
                                                    name="usernameOrEmail"
                                                    autoComplete="username"
                                                    value={credentials.usernameOrEmail}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                />
                                            </Form.Label>
                                        </Form.Group>
                                        <LinkContainer to="/forgot-username" >
                                            <Button variant="link" disabled={loading} className="w-100 text-end text-secondary">Forgot username?</Button>
                                        </LinkContainer>
                                        <Form.Group>
                                            <Form.Label className="w-100">Password:
                                                <div className="input-group">
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        autoComplete="current-password"
                                                        value={credentials.password}
                                                        onChange={handleChange}
                                                        required
                                                        disabled={loading}
                                                    />
                                                    <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                    </Button>
                                                </div>
                                            </Form.Label>
                                        </Form.Group>
                                        <Form.Group className="d-flex flex-column flex-column-reverse flex-sm-row justify-content-between align-items-baseline mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Remember Me"
                                                id="rememberMeCheckbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                disabled={loading}
                                            />
                                            <LinkContainer to="/forgot-password" >
                                                <Button variant="link" disabled={loading} className="w-xs-100 w-sm-auto text-end text-secondary">Forgot password?</Button>
                                            </LinkContainer>
                                        </Form.Group>
                                        <Button type="submit" disabled={loading} className="text-nowrap overflow-hidden w-100 mt-2 mb-4 mb-xxxl-5">
                                            {loading ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                    &nbsp;Signing in...
                                                </>
                                            ) : "Sign In"}
                                        </Button>
                                        {/*
                                        <div className="d-flex flex-column flex-md-row justify-content-between">
                                            <LinkContainer to="/forgot-password">
                                                <Button variant="warning" className="text-nowrap overflow-hidden w-lg-48 w-xxxl-45 mb-4 mb-md-0 ">Forgot Password?</Button>
                                            </LinkContainer>
                                            <LinkContainer to="/signup">
                                                <Button variant="success" className="text-nowrap overflow-hidden w-lg-48 w-xxxl-45">Have no account?</Button>
                                            </LinkContainer>
                                        </div>
                                        */}
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
