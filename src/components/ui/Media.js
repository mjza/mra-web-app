import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getPresignedUrlService } from '../../services/file';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faMusic, faTrash } from '@fortawesome/free-solid-svg-icons';

const Media = ({ countryISOCode, domain, acceptedTypes, initialUrl, onDelete }) => {
    const { user } = useUser();
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState(initialUrl);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const acceptedFileTypes = {
        images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/heic', 'image/heif'],
        videos: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
        audios: ['audio/mpeg', 'audio/wav', 'audio/ogg']
    };

    useEffect(() => {
        setUrl(initialUrl);
    }, [initialUrl]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && acceptedFileTypes[acceptedTypes].includes(selectedFile.type)) {
            setFile(selectedFile);
            setModalMessage('');
            handleFileUpload(selectedFile);
        } else {
            setModalMessage('Please select a valid file type.');
            setShowModal(true);
        }
    };

    const handleFileUpload = async (selectedFile) => {
        if (!user || !user.token) {
            setModalMessage('You must login first to be able to upload a file.');
            setShowModal(true);
            return;
        }

        if (!selectedFile) {
            setModalMessage('No file selected.');
            setShowModal(true);
            return;
        }

        const token = user.token;

        const { success, presignedUrl, message, headers } = await getPresignedUrlService(
            token,
            countryISOCode,
            domain,
            selectedFile.name,
            selectedFile.type,
            selectedFile.size
        );

        if (!success) {
            setModalMessage(message);
            setShowModal(true);
            return;
        }

        try {
            const response = await fetch(presignedUrl, {
                method: 'PUT',
                body: selectedFile,
                headers
            });

            if (response.ok) {
                const fileUrl = presignedUrl.split('?')[0];
                setUrl(fileUrl);
                setModalMessage('File uploaded successfully!');
                setShowModal(false);
            } else {
                setModalMessage('File upload failed.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setModalMessage('Network error, please try again later.');
            setShowModal(true);
        }
    };

    const handleDelete = () => {
        setUrl(null);
        setFile(null);
        setProgress(0);
        if (onDelete) {
            onDelete();
        }
    };

    const getFileIcon = () => {
        switch (acceptedTypes) {
            case 'images':
                return <FontAwesomeIcon icon={faImage} size="3x" />;
            case 'videos':
                return <FontAwesomeIcon icon={faVideo} size="3x" />;
            case 'audios':
                return <FontAwesomeIcon icon={faMusic} size="3x" />;
            default:
                return null;
        }
    };

    return (
        <div className="border p-2" style={{ maxWidth: '300px', height: '300px' }}>
            {url ? (
                <div className="d-flex flex-column align-items-center">
                    {acceptedTypes === 'images' && <img src={url} alt="Uploaded media" className="img-fluid" />}
                    {acceptedTypes === 'videos' && <video src={url} controls className="img-fluid" />}
                    {acceptedTypes === 'audios' && <audio src={url} controls className="img-fluid" />}
                    <button onClick={handleDelete} className="btn btn-danger mt-2">
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </div>
            ) : (
                <div className="d-flex flex-column align-items-center">
                    <input type="file" accept={acceptedFileTypes[acceptedTypes].join(',')} onChange={handleFileChange} hidden id="fileInput" />
                    <label htmlFor="fileInput" className="btn btn-light border">
                        {getFileIcon() || 'Select File'}
                    </label>
                    {progress > 0 && <ProgressBar now={progress} label={`${progress}%`} className="mt-2" />}
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Media;
