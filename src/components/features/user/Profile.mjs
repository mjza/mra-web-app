import { faFloppyDisk, faPencilAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext.mjs';
import { createUserDetails, fetchGenderTypes, fetchUserDetails, updateUserDetails } from '../../../services/core.mjs';
import { getAccessUrlsService, getLargestImageUrl, parseS3Url } from '../../../services/file.mjs';
import Img from '../../ui/Image.mjs';
import LoadingOverlay from '../../ui/LoadingOverlay.mjs';

const Profile = () => {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isNewProfilePicture, setIsNewProfilePicture] = useState(false);
    const { user, updateProfilePictureUrl } = useUser();
    const { userId, token } = user;
    const [userDetails, setUserDetails] = useState({
        userId: null,
        firstName: null,
        middleName: null,
        lastName: null,
        displayName: null,
        email: null,
        genderId: null,
        dateOfBirth: null,
        profilePictureUrl: null,
        isPrivatePicture: false,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [genderTypes, setGenderTypes] = useState([]);

    const filterUserDetails = (data) => {
        function isValidDate(dateString) {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date.getTime());
        }
        const {
            userId,
            firstName,
            middleName,
            lastName,
            displayName,
            email,
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
            displayName,
            email,
            genderId: (genderId !== '' ? genderId : null),
            dateOfBirth: (isValidDate(dateOfBirth) ? dateOfBirth : null),
            profilePictureUrl,
            isPrivatePicture,
        };
    };

    useEffect(() => {
        const fetchAndSetGenderTypes = async () => {
            try {
                const response = await fetchGenderTypes();
                if (response.success) {
                    const sortedGenderTypes = response.data.sort((a, b) => a.sortOrder - b.sortOrder);
                    setGenderTypes(sortedGenderTypes);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                console.error('Error fetching gender types:', error);
                setError('Failed to fetch gender types.');
            }
        };

        const loadAllData = async () => {
            setLoading(true);
            await fetchAndSetGenderTypes();
            await loadCurrentUserDetails(userId, token);
            setLoading(false);
        };

        loadAllData();
    }, [userId, token]);


    const loadCurrentUserDetails = async (userId, token) => {
        setIsEditing(false);
        if (!userId || !token)
            return;
        fetchUserDetails(token, { userId }).then(response => {
            if (response.success) {
                setUserDetails(response.data[0]);
            }
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const clearItem = (e) => {
        const { name } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: null,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const isEditing = !!userDetails.creator;
        const data = filterUserDetails(userDetails);
        if (isEditing) {
            updateUserDetails(user.token, data.userId, data).then(async response => {
                if (response.success) {
                    await updateProfilePictureUrl(data.profilePictureUrl);
                    setMessage(response.message);
                    setIsEditing(false);

                } else {
                    setError(response.message);
                }
            });
        } else {
            createUserDetails(user.token, data).then(async response => {
                if (response.success) {
                    await updateProfilePictureUrl(data.profilePictureUrl);
                    setMessage(response.message);
                    setUserDetails(response.data);
                    setIsEditing(false);
                } else {
                    setError(response.message);
                }
            });
        }
    };

    const handleDeleteImage = () => {
        setUserDetails(prevDetails => ({
            ...prevDetails,
            profilePictureUrl: null,
        }));
    };

    const handleUploadImage = async (baseUrl) => {
        let newProfilePictureUrl = null;
        try {
            const token = user?.token;
            const { domain } = parseS3Url(baseUrl);
            const response = await getAccessUrlsService(token, domain, [baseUrl]);
            if (response.success) {
                const urls = response.urls[baseUrl];
                newProfilePictureUrl = getLargestImageUrl(urls);
            }
        } catch {
            newProfilePictureUrl = baseUrl;
        }
        setUserDetails(prevDetails => ({
            ...prevDetails,
            profilePictureUrl: newProfilePictureUrl,
        }));
        setIsNewProfilePicture(true);
    };

    const handleUploadingImage = async (flag) => {
        setUploading(flag);
    };

    if (!user || !user.token) {
        return <Navigate to="/signin?redirect=%2Fprofile" replace={true} />;
    }

    return (
        <>
            <div className='min-vh-100 d-flex flex-column justify-content-center align-items-center py-5'>
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 py-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container className='unfeature-box p-4 rounded-4 border border-dark'>
                            <Form onSubmit={handleSubmit} className="w-100">
                                <div className='d-flex flex-row justify-content-between align-items-center mb-3 mb-xxl-4 mb-xxxl-5'>
                                    <h1 className="display-6 text-primary">Update Your Personal Details</h1>
                                    {!isEditing &&
                                        <Button
                                            variant="basic"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setError('');
                                                setMessage('');
                                                setIsEditing(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faPencilAlt} className='text-primary' />
                                        </Button>
                                    }
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
                                {message &&
                                    <Alert variant="success">
                                        <b>Success:</b><br />
                                        {message.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </Alert>
                                }

                                <div className='d-flex flex-row justify-content-around align-items-center mb-3 mb-xxl-4 mb-xxxl-5'>
                                    <Img
                                        size={{ maxWidth: '300px', width: '100%', aspectRatio: '1/1' }}
                                        borderType="rounded-circle"
                                        countryISOCode="ur"
                                        domain="1"
                                        initialUrls={isEditing ? (isNewProfilePicture ? userDetails.profilePictureUrl : (userDetails.profilePictureUrl ? user.profilePictureBase64 : null)) : user.profilePictureBase64}
                                        onUpload={isEditing ? handleUploadImage : undefined}
                                        onUploading={isEditing ? handleUploadingImage : undefined}
                                        onDelete={isEditing && !loading ? handleDeleteImage : undefined}
                                    />
                                </div>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">First name:
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={userDetails.firstName ?? ''}
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
                                            value={userDetails.middleName ?? ''}
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
                                            value={userDetails.lastName ?? ''}
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
                                            value={userDetails.displayName ?? ''}
                                            onChange={handleChange}
                                            disabled={!isEditing || loading}
                                        />
                                        <Form.Text className="text-muted">
                                            It is shown to public.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Email:
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            autoComplete='off'
                                            value={userDetails.email ?? ''}
                                            onChange={handleChange}
                                            disabled={true}
                                        />
                                        <Form.Text className="text-muted">
                                            It can't be changed.
                                        </Form.Text>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Gender:
                                        <InputGroup>
                                            <Form.Control
                                                as="select"
                                                name="genderId"
                                                value={userDetails.genderId ?? ''}
                                                onChange={handleChange}
                                                disabled={!isEditing || loading}
                                            >
                                                {userDetails.genderId ?? <option value="">Select Gender</option>}
                                                {genderTypes.map(gender => (
                                                    <option key={gender.genderId} value={gender.genderId}>
                                                        {gender.genderName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            {isEditing && (
                                                <Button
                                                    variant="outline-secondary"
                                                    name="genderId"
                                                    onClick={clearItem}
                                                    disabled={loading}
                                                    className="input-group-text"
                                                >
                                                    &times;
                                                </Button>
                                            )}
                                        </InputGroup>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">Date of Birth:
                                        <InputGroup>
                                            <Form.Control
                                                type="date"
                                                name="dateOfBirth"
                                                value={userDetails.dateOfBirth ?? ''}
                                                onChange={handleChange}
                                                disabled={!isEditing || loading}
                                            />
                                            {isEditing && (
                                                <Button
                                                    variant="outline-secondary"
                                                    name="dateOfBirth"
                                                    onClick={clearItem}
                                                    disabled={loading}
                                                    className="input-group-text"
                                                >
                                                    &times;
                                                </Button>
                                            )}
                                        </InputGroup>
                                    </Form.Label>
                                </Form.Group>
                                {isEditing && (
                                    <div className='d-flex flex-row justify-content-between align-items-center mt-2 mb-4 mb-xxxl-5'>
                                        <Button variant="primary" type="submit" disabled={!isEditing || loading || uploading} className="text-nowrap overflow-hidden">
                                            {loading ?
                                                (
                                                    <>
                                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                        &nbsp;Saving...
                                                    </>
                                                )
                                                :
                                                (<>
                                                    <FontAwesomeIcon icon={faFloppyDisk} />&nbsp;Save
                                                </>
                                                )
                                            }
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                loadCurrentUserDetails(userId, token);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faUndo} /> Cancel
                                        </Button>
                                    </div>
                                )}
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
