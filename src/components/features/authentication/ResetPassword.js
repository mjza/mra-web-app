import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { resetPassword } from '../../../services/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertVariant, setAlertVariant] = useState('danger');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword(!showRepeatPassword);
    };

    const username = searchParams.get('username');
    const token = searchParams.get('token');
    const data = searchParams.get('data');

    useEffect(() => {
        if (!username || !token || !data) {
            setMessage('Invalid or expired link.');
            setAlertVariant('danger');
        }
    }, [username, token, data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = [];

        // Password validations
        if (newPassword.length < 8 || newPassword.length > 30) {
            errors.push('Password must be between 8 and 30 characters.');
        }
        if (!/[A-Z]/.test(newPassword)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/[a-z]/.test(newPassword)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/\d/.test(newPassword)) {
            errors.push('Password must contain at least one digit.');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            errors.push('Password must contain at least one symbol.');
        }
        if (newPassword !== repeatPassword) {
            errors.push('Passwords do not match.');
        }

        if (errors.length > 0) {
            setMessage('Errors:\n' + errors.map((err, index) => `${index + 1}. ${err}`).join('\n'));
            setAlertVariant('danger');
            return;
        }

        setLoading(true);
        const response = await resetPassword(username, token, data, newPassword);
        setLoading(false);

        setMessage(response.message);
        setAlertVariant(response.success ? 'success' : 'danger');
    };

    return (
        <>
            <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center py-5 feature-box">
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col>
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 pt-4 pt-md-5 mx-0'>
                        <Container className='unfeature-box p-4 rounded-4'>
                            <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Set a New Password</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-2 mb-xxxl-4 d-none">
                                    <Form.Label className="w-100">Username:
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            autoComplete="off"
                                            value={username}
                                            required
                                            disabled
                                        />
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">New Password:
                                        <div className="input-group">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                autoComplete="new-password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                            <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </Button>
                                        </div>
                                        <Form.Text className="text-muted">
                                            Make sure your password is strong.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Repeat Password:
                                        <div className="input-group">
                                            <Form.Control
                                                type={showRepeatPassword ? "text" : "password"}
                                                name="repeatPassword"
                                                autoComplete="new-password"
                                                value={repeatPassword}
                                                onChange={(e) => setRepeatPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                            <Button variant="outline-secondary" onClick={toggleRepeatPasswordVisibility}>
                                                <FontAwesomeIcon icon={showRepeatPassword ? faEyeSlash : faEye} />
                                            </Button>
                                        </div>
                                    </Form.Label>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading} className="text-nowrap overflow-hidden w-100 mt-2 mb-4 mb-xxxl-5">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            &nbsp;Setting Password...
                                        </>
                                    ) : "Set Password"}
                                </Button>
                            </Form>
                            {message &&
                                <Alert variant={alertVariant} className="mt-3">
                                    {message.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </Alert>
                            }
                        </Container>
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col>
                </Row>
            </div>
        </>
    );
};

export default ResetPassword;
