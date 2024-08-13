import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { resetPassword } from '../../../services/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faDice } from '@fortawesome/free-solid-svg-icons';

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

    const suggestRandomPassword = () => {
        const groups = [
            'abcdefghijklmnopqrstuvwxyz', // Lowercase
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Uppercase
            '0123456789',                 // Numbers
            '`~!@#$%^&*()-_=+{}|\\[]:";\'<>?,./' // Special characters
        ];
        // Generate a random length between 8 and 30 that is a multiple of 4
        const passwordLength = Math.floor(Math.random() * (31 - 8) / 4) * 4 + 8;
        let password = '';

        // Build a password
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const length = i !== groups.length - 1 ? passwordLength / groups.length : passwordLength - password.length;
            for (let j = 0; j < length; j++) {
                password += group.charAt(Math.floor(Math.random() * group.length));
            }
        }

        // Shuffle the password to avoid group clustering
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        // Update state with new credentials
        setNewPassword(password);
        setRepeatPassword(password);
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
        if (!/[`~!@#$%^&*()-_=+{}|\\[\]:";'<>?,./]/.test(newPassword)) {
            errors.push('Password must contain at least one symbol.');
        }
        if (newPassword !== repeatPassword) {
            errors.push('Passwords do not match.');
        }

        if (errors.length > 0) {
            setMessage(errors.map((err, index) => `${index + 1}. ${err}`).join('\n'));
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
            <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center feature-box">
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col>
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 py-4 pt-md-5 mx-0'>
                        <Container className='unfeature-box p-4 rounded-4'>
                            <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Set a New Password</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Username:
                                    <div className="input-group">
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            autoComplete="off"
                                            value={username}
                                            required
                                            disabled
                                        />
                                        <Button variant="outline-secondary" onClick={suggestRandomPassword} disabled={loading}>
                                                <FontAwesomeIcon icon={faDice} />
                                            </Button>
                                        </div>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">New Password:
                                        <div className="input-group">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                autoComplete="off"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                            <Button variant="outline-secondary" onClick={togglePasswordVisibility} disabled={loading}>
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
                                                autoComplete="off"
                                                value={repeatPassword}
                                                onChange={(e) => setRepeatPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                            <Button variant="outline-secondary" onClick={toggleRepeatPasswordVisibility} disabled={loading}>
                                                <FontAwesomeIcon icon={showRepeatPassword ? faEyeSlash : faEye} />
                                            </Button>
                                        </div>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4 d-none">
                                    <Form.Label className="w-100">Hidden Password:
                                            <Form.Control
                                                type="password"
                                                name="passwordHidden"
                                                autoComplete="new-password"
                                            />
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
                                    {alertVariant === 'danger' && <><b>Errors:</b><br /></>}
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
