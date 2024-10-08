import { handlingErrors } from './utils.mjs';

const fileBaseURL = process.env.REACT_APP_FILE_BASE_URL;

const getLargestImageUrl = (urls) => {
    const sizeOrder = ['xs', 'sm', 'md', 'lg', 'xl'];

    return urls
        .sort((a, b) => {
            const sizeA = sizeOrder.findIndex(size => a.includes(`-${size}.`));
            const sizeB = sizeOrder.findIndex(size => b.includes(`-${size}.`));
            return sizeB - sizeA;
        })[0];
};

export { getLargestImageUrl };

const parseS3Url = (url) => {
    const match = url.match(/^https:\/\/([^.]+)\.s3\.([^.]+)\.amazonaws\.com\/(.+)$/);
    if (!match) {
        throw new Error(`Invalid S3 URL: ${url}`);
    }
    const [, bucketName, region, key] = match;

    // Extract domain and userId from the key
    const keyParts = key.split('/');
    // Find the domain and userId parts based on their positions
    const domainPart = keyParts[2]; // Domain is always the third part
    const userPart = keyParts[3]; // UserId is always the fourth part

    if (!domainPart || !userPart || !domainPart.startsWith('d') || !userPart.startsWith('u')) {
        throw new Error(`Invalid S3 key structure: ${key}`);
    }

    const domain = parseInt(domainPart.substring(1), 10); // Remove the 'd' prefix and convert to integer
    const userId = parseInt(userPart.substring(1), 10); // Remove the 'u' prefix and convert to integer

    if (isNaN(userId)) {
        throw new Error(`Invalid userId extracted from key: ${key}`);
    }

    return { bucketName, region, key, domain, userId };
};

export { parseS3Url };

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
