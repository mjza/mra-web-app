import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { getPresignedUrlService } from '../../services/file';

const FileUpload = () => {
    const { user } = useUser();
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'image/jpeg') {
            setFile(selectedFile);
        } else {
            setUploadStatus('Please select a JPEG file.');
        }
    };

    const handleFileUpload = async () => {
        if (!user || !user.token) {
            setUploadStatus('You must login first to be able to upload a file.');
            return;
        }

        if (!file) {
            setUploadStatus('No file selected.');
            return;
        }

        setUploadStatus('Uploading...');

        const token = user.token;  // Replace with your actual token
        const domain = '0'; // Replace with your actual domain ID

        const { success, presignedUrl, message, headers, exp } = await getPresignedUrlService(
            token,
            file.name,
            file.type,
            file.size,
            domain
        );

        if (!success) {
            setUploadStatus(message);
            return;
        }

        try {
            const response = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers,
                onUploadProgress: (progressEvent) => {
                    setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                }
            });

            if (response.ok) {
                setUploadStatus('File uploaded successfully!');
            } else {
                setUploadStatus('File upload failed.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Network error, please try again later.');
        }
    };

    return (
        <div>
            <input type="file" accept="image/jpeg" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            <div>{uploadStatus}</div>
            {progress > 0 && <div>Upload Progress: {progress}%</div>}
        </div>
    );
};

export default FileUpload;
