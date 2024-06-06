import React, { useState, useEffect } from 'react';
// import Image from './components/ui/Image';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faMapMarkerAlt, faImages } from '@fortawesome/free-solid-svg-icons';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { useUser } from '../../../contexts/UserContext';
const News = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const [ticket, setTicket] = useState({
        ticketId: null,
        title: null
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTicket(prevTicket => ({
            ...prevTicket,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const clearItem = (e) => {
        const { name } = e.target;
        setTicket(prevDetails => ({
            ...prevDetails,
            [name]: null,
        }));
    };
    /*
    const [mediaUrl, setMediaUrl] = //useState("https://mra-public-bucket.s3.us-east-2.amazonaws.com/images/ca/d1/u46/240525065449681-30a4-4122-1a9b-org.jpg");
        useState("https://mra-public-bucket.s3.us-east-2.amazonaws.com/images/ca/d1/u46/240525200734693-3b19-78a1-fad8-org.jpg");
    const handleDelete = () => {
        setMediaUrl(null);
        // Additional logic for handling delete, e.g., removing from server
        console.log('Media deleted');
    };

    let clickTimeout = null;

    const handleClick = () => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        } else {
            clickTimeout = setTimeout(() => {
                console.log('Image clicked');
                clickTimeout = null;
            }, 250);
        }
    };

    const handleDoubleClick = () => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        }
        console.log('Image double-clicked');
    };

    return (
        <div className='mh-100 py-5 feature-row'>
            <h1>&nbsp;</h1>
            <Image
                size={{ height: '300px', width: '300px' }}
                borderType="rounded-circle"
                countryISOCode="ca"
                domain="1"
                initialUrls={mediaUrl}  // Initial media URL, if any
                onDelete={handleDelete}  // Callback function for handling delete
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            />

        </div>
    );
    */
    return (
        <>
            <div className='min-vh-100 d-flex flex-column justify-content-start align-items-start py-5'>
                <Row className="w-100 p-0 m-0">
                    {loading && <LoadingOverlay />}
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 pt-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container className='unfeature-box py-2 px-3 rounded-4 border'>
                            <Form className="w-100">
                                <Form.Group className="mb-2 mb-xxxl-4">
                                    <Form.Label className="w-100">
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                placeholder="Start a new ticket by typing its title"
                                                value={ticket.title ?? ''}
                                                onChange={handleChange}
                                                disabled={false}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                name="genderId"
                                                onClick={() => { }}
                                                disabled={loading}
                                                className="input-group-text"
                                            >
                                                <FontAwesomeIcon icon={faPaperPlane} className='text-primary' />
                                            </Button>
                                        </InputGroup>
                                    </Form.Label>
                                </Form.Group>
                            </Form>
                            <div className="d-flex justify-content-between">
                                <Button
                                    variant="outline-secondary"
                                    name="startMedia"
                                    onClick={() => { }}
                                    disabled={loading}
                                    className="input-group-text"
                                >
                                    <FontAwesomeIcon icon={faImages} className='text-success'/> Start by media
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    name="startLocation"
                                    onClick={() => { }}
                                    disabled={loading}
                                    className="input-group-text"
                                >
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className='text-warning'/> Start by location
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    name="startNarrating"
                                    onClick={() => { }}
                                    disabled={loading}
                                    className="input-group-text"
                                >
                                    <FontAwesomeIcon icon={faMicrophone} className='text-danger'/> Start by narrating
                                </Button>
                            </div>
                        </Container>
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Right gap */}
                </Row>
            </div>
        </>
    );
};
export default News;