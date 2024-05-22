import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getPresignedUrlService, getAccessUrlsService } from '../../services/file';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrash } from '@fortawesome/free-solid-svg-icons';

const Media = ({ countryISOCode, domain, initialUrls, onDelete }) => {
    const { user } = useUser();
    const [progress, setProgress] = useState(0);
    const [urls, setUrls] = useState(initialUrls);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const acceptedFileTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/heic', 'image/heif'
    ];

    useEffect(() => {
        setUrls(initialUrls);
    }, [initialUrls]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && acceptedFileTypes.includes(selectedFile.type)) {
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

        const { success, presignedUrl, message, fields } = await getPresignedUrlService(
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
            const formData = new FormData();
            Object.keys(fields).forEach((key) => {
            formData.append(key, fields[key]);
            });
            formData.append('file', selectedFile);

            const response = await fetch(presignedUrl, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const baseUrl = `${presignedUrl}${fields.key}`; // url after post
                //const baseUrl = presignedUrl.split('?')[0]; // url after put
                setModalMessage('File uploaded successfully!');
                setShowModal(false);
                const response = await getAccessUrlsService(token, domain, [baseUrl]);
                if (response.success) {
                    setUrls(response.urls[baseUrl]);
                } else {
                    setModalMessage(response.message);
                }
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
        setUrls([]);
        setProgress(0);
        if (onDelete) {
            onDelete();
        }
    };

    const renderImage = (urls) => {
        const sizes = ["-xl.webp", "-lg.webp", "-md.webp", "-sm.webp", "-xs.webp", "-org"];
        const sortedUrls = sizes.map(size => urls.find(url => url.endsWith(size))).filter(Boolean);
        const src = sortedUrls[0] || urls.find(url => url.includes('-org')); // Fallback to original if specific sizes not found
        return (
          <img src={src} alt="Uploaded media" className="img-fluid" />
        );
      };

    return (
        <div className="border p-2" style={{ maxWidth: '300px', height: '300px' }}>
            {urls && Object.keys(urls).length > 0 ? (
                <div className="d-flex flex-column align-items-center">
                    {renderImage(urls)}
                    <button onClick={handleDelete} className="btn btn-danger mt-2">
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </div>
            ) : (
                <div className="d-flex flex-column align-items-center">
                    <input type="file" accept={acceptedFileTypes.join(',')} onChange={handleFileChange} hidden id="fileInput" />
                    <label htmlFor="fileInput" className="btn btn-light border">
                        <FontAwesomeIcon icon={faImage} size="3x" />
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
