import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../ui/LoadingOverlay.js';
import { registerService } from '../../../services/auth.js';
import { Container , Row , Col , Form , Button , Alert , Spinner} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faDice } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    const [userInfo, setUserInfo] = useState({
        username: '',
        displayName: '',
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword(!showRepeatPassword);
    };

    const suggestRandomCredentials = () => {
        // Characters to use in the username
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789_';
        const groups = [
            'abcdefghijklmnopqrstuvwxyz', // Lowercase
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Uppercase
            '0123456789',                 // Numbers
            '`~!@#$%^&*()-_=+{}|\\[]:";\'<>?,./' // Special characters
        ];
        // Generate a random length between 8 and 30 that is a multiple of 4
        const passwordLength = Math.floor(Math.random() * (31 - 8) / 4) * 4 + 8;
        const usernameLength = 7;
        let username = '';
        let password = '';

        // Build a username of the chosen length
        for (let i = 0; i < usernameLength; i++) {
            username += characters.charAt(Math.floor(Math.random() * characters.length));
        }

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
        setUserInfo(prevState => ({
            ...prevState,
            username: username,
            password: password,
            repeatPassword: password
        }));
    };


    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, repeatPassword, displayName } = userInfo;
        let errors = [];

        // Username validations
        if (!/^[A-Za-z0-9_]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, and underscores.');
        }
        if (username.length < 5 || username.length > 30) {
            errors.push('Username must be between 5 and 30 characters.');
        }

        // Email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push('Invalid email address.');
        }

        // Password validations
        if (password.length < 8 || password.length > 30) {
            errors.push('Password must be between 8 and 30 characters.');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one digit.');
        }
        if (!/[`~!@#$%^&*()-_=+{}|\\[\]:";'<>?,./]/.test(password)) {
            errors.push('Password must contain at least one symbol.');
        }
        if (password !== repeatPassword) {
            errors.push('Passwords do not match.');
        }

        if (errors.length > 0) {
            var evaluation = errors.map((err, index) => `${index + 1}. ${err}`).join('\n');
            setError(evaluation);
            return;
        }

        setLoading(true);
        const { success, message } = await registerService(username, displayName, email, password);
        setLoading(false);
        if (success) {
            navigate('/registration-success', { replace: true });
        } else {
            setError(message);
        }
    };

    return (
        <>
            <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center feature-box">
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 py-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container className='unfeature-box p-4 rounded-4'>
                            <Form onSubmit={handleSubmit} className="w-100">
                                <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Create Your Account</h1>
                                {error &&
                                    <Alert variant="danger">
                                        <b>Errors:</b><br />
                                        {error.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </Alert>
                                }
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Username: <span className="text-danger">*</span>
                                        <div className="input-group">
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={userInfo.username}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                            <Button variant="outline-secondary" onClick={suggestRandomCredentials} disabled={loading}>
                                                <FontAwesomeIcon icon={faDice} />
                                            </Button>
                                        </div>
                                        <Form.Text className="text-muted">
                                            Can be generated automatically by the dice button.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Display name:
                                        <Form.Control
                                            type="text"
                                            name="displayName"
                                            value={userInfo.displayName}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <Form.Text className="text-muted">
                                            If leave empty the username will be used.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Email: <span className="text-danger">*</span>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={userInfo.email}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                        <Form.Text className="text-muted">
                                            Will be used for activation.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Password: <span className="text-danger">*</span>
                                        <div className="input-group">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={userInfo.password}
                                                onChange={handleChange}
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
                                    <Form.Label className="w-100">Repeat Password: <span className="text-danger">*</span>
                                        <div className="input-group">
                                            <Form.Control
                                                type={showRepeatPassword ? "text" : "password"}
                                                name="repeatPassword"
                                                value={userInfo.repeatPassword}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                            <Button variant="outline-secondary" onClick={toggleRepeatPasswordVisibility} disabled={loading}>
                                                <FontAwesomeIcon icon={showRepeatPassword ? faEyeSlash : faEye} />
                                            </Button>
                                        </div>
                                        <Form.Text className="text-muted">
                                            Must be exactly the same as your password.
                                        </Form.Text>
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
                                <div className="d-flex flex-row justify-content-center mt-2">
                                    <div>
                                        Registered but not yet activated?&nbsp;
                                        <a href="/resend-activation" className="text-decoration-none">Resend activation</a>
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
