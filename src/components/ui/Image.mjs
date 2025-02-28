import { faCamera, faCircleXmark, faSpinner, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext.mjs';
import { getAccessUrlsService, getPresignedUrlService, parseS3Url } from '../../services/file.mjs';

const Img = ({
    size: { maxHeight = '100%', maxWidth = '100%', height = 'auto', width = '100%', aspectRatio = 'auto' } = {},
    borderType,
    countryISOCode,
    domain,
    initialUrls = [],
    onUpload,
    onUploading,
    onDelete,
    onClick,
    onDoubleClick
}) => {
    const acceptedFileTypes = ['jpeg', 'jpg', 'png', 'gif', 'bmp',];
    const { user } = useUser();
    const [progress, setProgress] = useState(0);
    const [counter, setCounter] = useState(1);
    const [urls, setUrls] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [buttonBgColor, setButtonBgColor] = useState('black');
    const [isHorizontal, setIsHorizontal] = useState(true);
    const imgRef = useRef(null);

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };    

    const fetchUrls = useCallback(async (baseUrl) => {
        setProcessing(true);
        try {
            const token = user?.token;
            const { domain } = parseS3Url(baseUrl);
            const response = await getAccessUrlsService(token, domain, [baseUrl]);
            if (response.success) {
                setUrls(response.urls[baseUrl]);
            }
        } catch {
            setUrls([baseUrl]);
        }
        setProcessing(false);
        setProgress(0);
        setCounter(1);
    }, [user]);

    useEffect(() => {
        if(typeof onUploading === 'function'){
            onUploading(uploading || processing);
        }
    }, [uploading, processing, onUploading]);

    useEffect(() => {
        if (typeof initialUrls === 'string') {
            fetchUrls(initialUrls);
        } else {
            setUrls(initialUrls);
        }
    }, [initialUrls, fetchUrls]);

    useEffect(() => {
        let intervalId;
        if (processing) {
            intervalId = setInterval(() => {
                setCounter(prevCounter => prevCounter + 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
            setCounter(1);
        }
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [processing]);

    useEffect(() => {
        const img = imgRef.current;
        const handleLoad = () => {
            const { naturalWidth, naturalHeight } = img;
            setIsHorizontal(naturalWidth >= naturalHeight);
            extractColor(img);
        };
        if (img && img.complete) {
            handleLoad();
        } else if (img) {
            // Extract color once image is loaded
            img.addEventListener('load', handleLoad);
            // Cleanup function to remove the event listener
            return () => {
                img.removeEventListener('load', handleLoad);
            };
        }

    }, [urls]);

    const extractColor = (img) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height);

        // Define the size of the square
        const squareSize = 20;
        const startX = img.width - 35;
        const startY = 15;

        // Get the color data from the top-right 20x20 pixels
        const imageData = context.getImageData(startX, startY, squareSize, squareSize);
        const { data } = imageData;

        // Calculate the average color
        let rTotal = 0, gTotal = 0, bTotal = 0, pixelCount = 0;
        for (let i = 0; i < data.length; i += 4) {
            rTotal += data[i];
            gTotal += data[i + 1];
            bTotal += data[i + 2];
            pixelCount++;
        }
        const rAvg = rTotal / pixelCount;
        const gAvg = gTotal / pixelCount;
        const bAvg = bTotal / pixelCount;

        // Calculate the luminance of the average color
        const luminance = (0.299 * rAvg + 0.587 * gAvg + 0.114 * bAvg) / 255;
        setButtonBgColor(luminance > 0.7 ? 'black' : 'white');
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        // Check if the file extension is accepted
        if (selectedFile && acceptedFileTypes.includes(`${getFileExtension(selectedFile.name)}`)) {
            setModalMessage('');
            await handleFileUpload(selectedFile);
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
            setUploading(true);
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
                setUploading(false);
                if (xhr.status === 204) {
                    const baseUrl = `${presignedUrl}${fields.key}`;
                    fetchUrls(baseUrl);
                    onUpload && onUpload(baseUrl);                    
                } else {
                    setModalMessage('File upload failed.');
                    setShowModal(true);
                }
            };

            xhr.onerror = (error) => {
                console.log(error);
                setUploading(false);
                setModalMessage('Upload error.');
                setShowModal(true);
            };

            xhr.send(formData);
        } catch (error) {
            console.error('Error uploading file:', error);
            setModalMessage('Network error, please try again later.');
            setShowModal(true);
            setUploading(false);
        }
    };

    const handleDelete = onDelete ? () => {
        onDelete(urls);
        setUrls([]);
        setUploading(0);
        setProgress(0);        
    } : undefined;


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
        const baseImageUrl = urls.length > 1 ? urls.find(url => url.includes('-org.')) : urls.length > 0 ? urls[0] : null; // Fallback to original if specific sizes not found
        return (
            <div className={`position-relative d-flex align-items-center justify-content-center overflow-hidden w-100 h-100 ${borderType ? borderType : ''}`}>
                <picture className={`${isHorizontal ? 'position-relative' : ''} ${borderType === 'rounded-circle' ? 'w-100 h-100' : ''}`}>
                    {sortedUrls.map((url, index) => url.media && (
                        <source key={index} srcSet={url.srcSet} media={url.media} />
                    ))}
                    <img
                        ref={imgRef}
                        src={baseImageUrl}
                        alt="Responsive media"
                        className='img-fluid flex-fill mw-100 mh-100 object-fit-cover'
                        crossOrigin="anonymous"
                        role={onClick || onDoubleClick ? 'button' : ''}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
                    />
                    {handleDelete && (
                        <button
                            onClick={handleDelete}
                            className="btn position-absolute"
                            style={{
                                top: borderType === 'rounded-circle' ? '20%' : '5px',
                                right: borderType === 'rounded-circle' ? '20%' : '5px',
                                transform: borderType === 'rounded-circle' ? 'translate(50%, -50%)' : 'none',
                                color: buttonBgColor
                            }}
                        >
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                </picture>
            </div>
        );
    };

    return (
        <div className={`position-relative border ${borderType ? borderType : ''}`} style={{ maxHeight, maxWidth, height, width, aspectRatio}}>
            {processing && (
                <div className="overlay position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(255,255,255,0.8)', }}>
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                </div>
            )}
            {urls && Object.keys(urls).length > 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100">
                    {renderImage(urls)}
                </div>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100">
                    <input
                        type="file"
                        accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
                        capture="environment"
                        onChange={handleFileChange}
                        hidden
                        id="fileInput"
                        disabled={uploading || processing}
                    />
                    <label
                        htmlFor="fileInput"
                        className={`btn btn-light border p-0 mh-100 mw-100 ${uploading || processing ? 'disabled' : ''}`}
                        style={{ pointerEvents: uploading || processing ? 'none' : 'auto' }}>
                        <FontAwesomeIcon icon={faCamera} size="2x" />
                    </label>
                    {progress > 0 && <ProgressBar now={progress} label={progress < 100 ? (
                        <span>
                            <FontAwesomeIcon icon={faUpload} /> {progress}%
                        </span>
                    ) : (
                        `Processing... ${counter}`
                    )} className="w-100 mt-2" style={{ height: "20px" }} />}
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

Image.propTypes = {
    size: PropTypes.shape({
        maxHeight: PropTypes.oneOfType([PropTypes.string]),
        maxWidth: PropTypes.oneOfType([PropTypes.string]),
        height: PropTypes.oneOfType([PropTypes.string]),
        width: PropTypes.oneOfType([PropTypes.string]),
        aspectRatio: PropTypes.oneOfType([PropTypes.string]),
    }),
    borderType: PropTypes.oneOf([undefined, 'rounded', 'rounded-circle']),
};

export default Img;
