import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getGeolocation } from '../../ui/utils';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faMapMarkerAlt, faImages } from '@fortawesome/free-solid-svg-icons';

const Feed = () => {
    const [ticket, setTicket] = useState({ title: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTicket(prevTicket => ({
            ...prevTicket,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleStartTicket = (e) => {
        const title = ticket.title.trim();
        if (title) {
          navigate(`/new-ticket/1?title=${encodeURIComponent(title)}`);
        }
      };
    
    return (
        <>
            <div className='min-vh-100 d-flex flex-column justify-content-start align-items-start'>
                <Row className="w-100 p-0 m-0">
                    <Col xs={1} sm={1} md={1} lg={2} xl={3} xxl={4}></Col> {/* Left gap */}
                    <Col xs={10} sm={10} md={10} lg={8} xl={6} xxl={4} className='px-0 py-4 pt-md-5 mx-0'> {/* Center content */}
                        <Container className='unfeature-box py-2 px-3 rounded-4 border'>
                            <Form className="w-100">
                            <h1 className="display-6 text-primary mb-3 mb-xxl-4 mb-xxxl-5">Start a new ticket</h1>
                                <Form.Group className="mb-2">
                                    <Form.Label className="w-100">
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                placeholder="e.g., Broken street light ..."
                                                value={ticket.title ?? ''}
                                                onChange={handleChange}
                                                disabled={false}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                name="genderId"
                                                onClick={handleStartTicket}
                                                className="input-group-text"
                                                disabled={!ticket.title.trim()}
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
                                    onClick={() => {
                                        //capture()
                                    }}
                                    className="input-group-text me-1 px-auto text-truncate"
                                >
                                    <FontAwesomeIcon icon={faImages} className='text-success' /><span className='d-none d-sm-inline'>&nbsp;Start by media</span>
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    name="startLocation"
                                    onClick={() => { getGeolocation() }}
                                    className="input-group-text px-auto text-truncate"
                                >
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className='text-warning' /><span className='d-none d-sm-inline'>&nbsp;Start by location</span>
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    name="startNarrating"
                                    onClick={() => { }}
                                    className="input-group-text ms-1 px-auto text-truncate"
                                >
                                    <FontAwesomeIcon icon={faMicrophone} className='text-danger' /><span className='d-none d-sm-inline'>&nbsp;Start by narrating</span>
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
export default Feed;