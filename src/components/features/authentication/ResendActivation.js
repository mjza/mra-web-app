import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { resendActivation } from '../../../services/auth';
import LoadingOverlay from '../../ui/LoadingOverlay';


const ResendActivation = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertVariant, setAlertVariant] = useState('danger');
    const [formDisabled, setFormDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(usernameOrEmail);
        if (!usernameOrEmail || (!/\s*\S+@\S+\.\S+\s*/.test(usernameOrEmail) && !/\s*\S+\s*/.test(usernameOrEmail)) ) {
            setMessage('Please enter a valid email address or a username.');
            setAlertVariant('danger');
            return;
        }

        setLoading(true);
        const response = await resendActivation(usernameOrEmail.trim());
        setLoading(false);

        setMessage(response.message);
        setAlertVariant(response.success ? 'success' : 'danger');
        setFormDisabled(response.success);
    };

    return (
        <>
            <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center py-5 feature-box">
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 py-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container className='unfeature-box p-4 rounded-4'>
                            <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Resend Activation Email</h1>
                            <h6 className='text-muted'><i>No problem, use the below form to have a new activation email sent to you.</i></h6>
                            <Form onSubmit={handleSubmit} >
                                <Form.Group controlId="formBasicEmail" className="mb-3">
                                    <Form.Label className="w-100">Username or Email:
                                        <Form.Control
                                            type="text"
                                            name="usernameOrEmail"
                                            autoComplete="username"
                                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                                            required
                                            disabled={loading || formDisabled}
                                        />
                                    </Form.Label>
                                    <Form.Text className="text-muted">
                                        It is better you enter your username if you have several users.
                                    </Form.Text>
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={loading || formDisabled} className="text-nowrap overflow-hidden w-100 mt-2 mb-4 mb-xxxl-5">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            &nbsp;Loading...
                                        </>
                                    ) : "Retrieve Username"}
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

export default ResendActivation;
