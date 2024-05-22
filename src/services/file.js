const fileBaseURL = process.env.REACT_APP_FILE_BASE_URL;

const handlingErrors = (data, message) => {
    if (data.errors && data.errors.length) {
        // Combine all error messages into one string
        message = data.errors.map((err, index) => `${index + 1}. ${err.msg}`).join('\n');
    }
    if (data.message)
        return data.message;
    return message;
}

/**
 * `getPresignedUrlService` requests a presigned URL from the server for performing file operations.
 *
 * @param {string} token - The secret token required to authorize the password reset.
 * @param {string} countryISOCode - The ISO code of the country.
 * @param {number} domain - The domain ID associated with the user or operation.
 * @param {string} fileName - The name of the file for which the presigned URL is requested.
 * @param {string} fileType - The MIME type of the file.
 * @param {number} fileSize - The fileSize is a number representing the file size in bytes.
 * @returns {Promise<{success: boolean, presignedUrl?: string, exp?: number, message?: string}>} A promise that resolves to an object indicating the result of the request. Includes the presigned URL and its expiration time on success.
 */
const getPresignedUrlService = async (token, countryISOCode, domain, fileName, fileType, fileSize) => {
    try {
        const queryParams = new URLSearchParams({
            countryISOCode,
            domain,
            fileName,
            fileType,
            fileSize
        }).toString();

        const response = await fetch(`${fileBaseURL}/v1/generate-presigned-post-url?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, presignedUrl: result.presignedUrl, fields: result.fields, exp: result.exp };
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

/**
 * `getAccessUrlsService` sends a list of S3 URLs to the server to generate access URLs.
 *
 * @param {string} token - The secret token required for authorization.
 * @param {number} domain - The domain ID associated with the user or operation.
 * @param {Array<string>} urls - An array of S3 URLs for which access URLs are needed.
 * @returns {Promise<{success: boolean, urls?: object, message?: string}>} A promise that resolves to an object indicating the result of the request. Includes the access URLs on success.
 */
const getAccessUrlsService = async (token, domain, urls) => {
    try {
        const requestBody = {
            domain,
            urls
        };

        const response = await fetch(`${fileBaseURL}/v1/generate-access-urls`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, urls: result.urls };
        } else {
            const message = handlingErrors(result, 'Failed to generate access URLs, please try again.');
            return { success: false, message };
        }
    } catch (error) {
        console.error('Error generating access URLs:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { getAccessUrlsService };