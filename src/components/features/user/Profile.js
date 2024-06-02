import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { useUser } from '../../../contexts/UserContext';
import { fetchUserDetails, createUserDetails, updateUserDetails } from '../../../services/core';

const Profile = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const [userDetails, setUserDetails] = useState({
        userId: '',
        firstName: '',
        middleName: '',
        lastName: '',
        genderId: '',
        dateOfBirth: '',
        profilePictureUrl: '',
        isPrivatePicture: false,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    const filterUserDetails = (data) => {
        const {
            userId,
            firstName,
            middleName,
            lastName,
            genderId,
            dateOfBirth,
            profilePictureUrl,
            isPrivatePicture,
        } = data;
    
        return {
            userId,
            firstName,
            middleName,
            lastName,
            genderId,
            dateOfBirth,
            profilePictureUrl,
            isPrivatePicture,
        };
    };

    useEffect(() => {
        handleReturnBack(user);
    }, [user]);

    const handleReturnBack = async (user) => {
        setIsEditing(false);
        if (user) {
            const { userId, token } = user;
            fetchUserDetails(token, { userId }).then(response => {
                if (response.success) {
                    setUserDetails(response.data[0]);
                } else {
                    setMessage(response.message);
                }
            });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userDetails.userId) {
            updateUserDetails(user.token, userDetails.userId, filterUserDetails(userDetails)).then(response => {
                setMessage(response.message);
                if (response.success) {
                    setIsEditing(false);
                }
            });
        } else {
            userDetails.userId = user.userId;
            createUserDetails(user.token, filterUserDetails(userDetails)).then(response => {
                setMessage(response.message);
                if (response.success) {
                    setUserDetails(response.data);
                    setIsEditing(false);
                }
            });
        }
    };

    if (!user || !user.token) {
        return <Navigate to="/signin?redirect=%2Fprofile" replace={true} />;
    }

    return (
        <>
            <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center py-5 feature-box">
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 pt-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container className='unfeature-box p-4 rounded-4'>
                            <Form onSubmit={handleSubmit} className="w-100">
                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                    <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Update Your Personal Details</h1>
                                    {isEditing ? (
                                        <button className="btn btn-outline-primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleReturnBack(user);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faUndo} />
                                        </button>
                                    ) : (
                                        <button className="btn btn-outline-primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsEditing(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </button>
                                    )}
                                </div>
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
                                    <Form.Label className="w-100">First name:
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={userDetails.firstName}
                                            onChange={handleChange}
                                            disabled={!isEditing || loading}
                                        />
                                        <Form.Text className="text-muted">
                                            Only registered organizations can see it.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Middle name:
                                        <Form.Control
                                            type="text"
                                            name="middleName"
                                            value={userDetails.middleName}
                                            onChange={handleChange}
                                            disabled={!isEditing || loading}
                                        />
                                        <Form.Text className="text-muted">
                                            Only registered organizations can see it.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Last name:
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={userDetails.lastName}
                                            onChange={handleChange}
                                            disabled={!isEditing || loading}
                                        />
                                        <Form.Text className="text-muted">
                                            Only registered organizations can see it.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Display name:
                                        <Form.Control
                                            type="text"
                                            name="displayName"
                                            value={userDetails.displayName}
                                            onChange={handleChange}
                                            disabled={!isEditing || loading}
                                        />
                                        <Form.Text className="text-muted">
                                            It will be shown to public.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Email:
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            value={userDetails.email}
                                            disabled={true}
                                        />
                                        <Form.Text className="text-muted">
                                            Cannot be change.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                {isEditing && <Button variant="primary" type="submit" disabled={!isEditing || loading} className="text-nowrap overflow-hidden mt-2 mb-4 mb-xxxl-5">
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            &nbsp;Saving...
                                        </>
                                    ) : "Save"}
                                </Button>}
                            </Form>
                        </Container>
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Right gap */}
                </Row>
            </div>
        </>
    );
};

export default Profile;
