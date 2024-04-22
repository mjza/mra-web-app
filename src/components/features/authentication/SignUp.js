import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { registerService } from '../../../services/auth';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';

const SignUp = () => {
    const usernameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const repeatPasswordRef = useRef('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const repeatPassword = repeatPasswordRef.current.value;

        if (password !== repeatPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        const { success, message } = await registerService(username, email, password);
        setLoading(false);
        if (success) {
            navigate('/registration-success', { replace: true });
        } else {
            setError(message);
        }
    };

    return (
        <>
            <div className="min-vh-100 align-items-center py-5 feature-box">
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 pt-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container className='unfeature-box p-4 rounded-4'>
                            <Form onSubmit={handleSubmit} className="w-100">
                                <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Create Your Account</h1>
                                {error &&
                                    <Alert variant="danger">
                                        {error.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </Alert>
                                }
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        autoComplete="username"
                                        ref={usernameRef}
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        ref={emailRef}
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        ref={passwordRef}
                                        required
                                        disabled={loading}
                                    />
                                    <Form.Text className="text-muted">
                                        Make sure your password is strong.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label>Repeat Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="repeatPassword"
                                        autoComplete="new-password"
                                        ref={repeatPasswordRef}
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <div className="mt-2 mb-3">
                                    By clicking Agree & Sign up or Continue, you agree to the ReportCycle&nbsp;
                                    <a href="/user-agreement" className="text-decoration-none">User Agreement</a>,&nbsp;
                                    <a href="/privacy-policy" className="text-decoration-none">Privacy Policy</a>, and&nbsp;
                                    <a href="/cookie-policy" className="text-decoration-none">Cookie Policy</a>.
                                </div>
                                <Button variant="primary" type="submit" disabled={loading} className="text-nowrap overflow-hidden w-100 mt-2 mb-4 mb-xxxl-5">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            &nbsp;Signing up...
                                        </>
                                    ) : "Agree & Sign up"}
                                </Button>
                                <div className="d-flex flex-row justify-content-center mt-2">
                                    <div>
                                        Already have an account?&nbsp;
                                        <a href="/signin" className="text-decoration-none">Sign in</a>
                                    </div>
                                </div>
                            </Form>
                        </Container>
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Right gap */}
                </Row>
            </div>
        </>
    );
};

export default SignUp;
