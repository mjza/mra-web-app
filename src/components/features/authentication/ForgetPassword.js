import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { requestPasswordResetToken } from '../../../services/auth';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertVariant, setAlertVariant] = useState('danger');
    const [formDisabled, setFormDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username) {
            setMessage('Please enter your username.');
            setAlertVariant('danger');
            return;
        }
        if (username.trim().length < 5 || username.trim().length > 30) {
            setMessage('Username must be between 5 and 30 characters.');
            setAlertVariant('danger');
            return;
        }

        setLoading(true);
        const response = await requestPasswordResetToken(username);
        setLoading(false);

        setMessage(response.message);
        setAlertVariant(response.success ? 'success' : 'danger');
        setFormDisabled(response.success);
    };

    return (
        <>
            <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center feature-box">
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 py-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container className='unfeature-box p-4 rounded-4'>
                            <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Reset Your Password</h1>
                            <Form onSubmit={handleSubmit} >
                                <Form.Group controlId="formBasicUsername" className="mb-3">
                                    <Form.Label className="w-100">Username:
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            autoComplete="username"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            disabled={loading || formDisabled}
                                        />
                                    </Form.Label>
                                    <Form.Text className="text-muted">
                                        We'll send a password reset link to the email associated with your account.
                                    </Form.Text>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading || formDisabled} className="text-nowrap overflow-hidden w-100 mt-2 mb-4 mb-xxxl-5">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            &nbsp;Loading...
                                        </>
                                    ) : "Send Reset Link"}
                                </Button>
                            </Form>
                            {message && (
                                <Alert variant={alertVariant} className="mt-3">
                                    {alertVariant === 'danger' && <><b>Errors:</b><br /></>}
                                    {message.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </Alert>
                            )}
                        </Container>
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Right gap */}
                </Row>
            </div>
        </>
    );
};

export default ForgotPassword;
