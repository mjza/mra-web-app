import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getPresignedUrlService, getAccessUrlsService } from '../../services/file';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
};

const Image = ({ countryISOCode, domain, initialUrls, onDelete }) => {
    const { user } = useUser();
    const [progress, setProgress] = useState(0);
    const [urls, setUrls] = useState(initialUrls);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const acceptedFileTypes = ['jpeg', 'jpg', 'png', 'gif', 'bmp', ];

    useEffect(() => {
        setUrls(initialUrls);
    }, [initialUrls]);

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];        

        // Check if the file extension is accepted
        if (selectedFile && acceptedFileTypes.includes(`${getFileExtension(selectedFile.name)}`)) {
            setUploading(true);
            setModalMessage('');
            await handleFileUpload(selectedFile);
            setUploading(false);
        } else {
            setModalMessage(`Please select a valid file type. Only these extensions {${acceptedFileTypes.join(',')}} are accepted.`);
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
        const fileExtension = getFileExtension(selectedFile.name);

        const { success, presignedUrl, message, fields } = await getPresignedUrlService(
            token,
            countryISOCode,
            domain,
            selectedFile.name,
            `image/${fileExtension}`,
            selectedFile.size
        );

        if (!success) {
            setModalMessage(message);
            setShowModal(true);
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(fields).forEach(key => formData.append(key, fields[key]));
            formData.append('file', selectedFile);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', presignedUrl, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded * 100) / event.total);                    
                    setProgress(percentComplete);
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 204) {
                    setProcessing(true);
                    const baseUrl = `${presignedUrl}${fields.key}`;
                    setModalMessage('File uploaded successfully!');
                    setShowModal(false);
                    const response = await getAccessUrlsService(token, domain, [baseUrl]);
                    if (response.success) {
                        setUrls(response.urls[baseUrl]);
                    } else {
                        setModalMessage(response.message);
                    }
                    setProcessing(false);
                } else {
                    setModalMessage('File upload failed.');
                    setShowModal(true);
                }
            };

            xhr.onerror = () => {
                console.log('Upload error');
            };

            xhr.send(formData);
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
        const sizeMap = [
            { key: '-xl.webp', media: '(min-width: 1200px)' },
            { key: '-lg.webp', media: '(min-width: 992px)' },
            { key: '-md.webp', media: '(min-width: 768px)' },
            { key: '-sm.webp', media: '(min-width: 576px)' },
            { key: '-xs.webp', media: '' }  // No media query for XS as it's the default
        ];
        const sortedUrls = sizeMap.filter(size => urls.find(url => url.includes(size.key))).map(size => ({
            srcSet: urls.find(url => url.includes(size.key)),
            media: size.media
        }));
        const baseImageUrl = urls.find(url => url.includes('-org.')); // Fallback to original if specific sizes not found
        return (
            <picture>
                {sortedUrls.map((url, index) => url.media && (
                    <source key={index} srcSet={url.srcSet} media={url.media} />
                ))}
                <img src={baseImageUrl} alt="Responsive media" className="img-fluid" />
            </picture>
        );
    };

    return (
        <div className="position-relative border p-2" style={{ maxWidth: '300px', height: '300px' }}>
            {processing && (
                <div className="overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                </div>
            )}
            {urls && Object.keys(urls).length > 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center position-relative">
                    {renderImage(urls)}
                    <button onClick={handleDelete} className="btn position-absolute" style={{ top: 5, right: 5 }}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    <input
                        type="file"
                        accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
                        onChange={handleFileChange}
                        hidden
                        id="fileInput"
                        disabled={uploading}
                    />
                    <label htmlFor="fileInput" className={`btn btn-light border ${uploading ? 'disabled' : ''}`}>
                        <FontAwesomeIcon icon={faImage} size="3x" />
                    </label>
                    {progress > 0 && <ProgressBar now={progress} label={`${progress}%`} className="w-100 mt-2" />}
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

export default Image;
