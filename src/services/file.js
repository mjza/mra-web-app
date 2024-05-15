const fileBaseURL = process.env.REACT_APP_FILE_BASE_URL;

const handlingErrors = (data, message) => {
    if (data.errors && data.errors.length) {
        // Combine all error messages into one string
        message = data.errors.map((err, index) => `${index + 1}. ${err.msg}`).join('\n');
    }
    if(data.message)
        return data.message;
    return message;
}

/**
 * `getPresignedUrlService` requests a presigned URL from the server for performing file operations.
 *
 * @param {string} token - The secret token required to authorize the password reset.
 * @param {string} fileName - The name of the file for which the presigned URL is requested.
 * @param {string} fileType - The MIME type of the file.
 * @param {number} fileSize - The fileSize is a number representing the file size in bytes.
 * @param {number} domain - The domain ID associated with the user or operation.
 * @returns {Promise<{success: boolean, presignedUrl?: string, exp?: number, message?: string}>} A promise that resolves to an object indicating the result of the request. Includes the presigned URL and its expiration time on success.
 */
const getPresignedUrlService = async (token, fileName, fileType, fileSize, domain) => {
    try {
        const queryParams = new URLSearchParams({
            fileName,
            fileType,
            domain,
            fileSize
        }).toString();

        const response = await fetch(`${fileBaseURL}/v1/generate-presigned-url?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, presignedUrl: result.presignedUrl, exp: result.exp };
        } else {
            const message = handlingErrors(result, 'Failed to generate presigned URL, please try again.');
            return { success: false, message };
        }
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}



export { getPresignedUrlService };
