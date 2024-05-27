import { handlingErrors } from './utils'; 

const coreBaseURL = process.env.REACT_APP_CORE_BASE_URL;

/**
 * Retrieves user details based on provided conditions and pagination.
 *
 * @param {Object} params - The parameters for the request.
 * @param {number} [params.userId] - Optional user ID to retrieve details for a specific user.
 * @param {number} [params.page=1] - Page number of the user details to retrieve.
 * @param {number} [params.limit=30] - Maximum number of user details to return in one response.
 * @returns {Promise<{success: boolean, message: string, data?: Object[], hasMore?: boolean}>} A promise that resolves to an object indicating the outcome of the request. Contains the user details data if successful.
 */
const fetchUserDetails = async ({ userId, page = 1, limit = 30 } = {}) => {
    try {
        const queryParams = new URLSearchParams({ userId, page, limit });
        const response = await fetch(`${coreBaseURL}/v1/user_details?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth method
            }
        });

        const result = await response.json();

        if (response.status === 200) {
            return { success: true, message: 'User details retrieved successfully', data: result.data, hasMore: result.hasMore };
        } else {
            const message = handlingErrors(result, 'Failed to retrieve user details, please try again.');
            return { success: false, message };
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { fetchUserDetails };

/**
 * Creates user details for the user whose ID matches the one in the JWT.
 *
 * @param {Object} userDetails - The user details to be created.
 * @param {number} userDetails.userId - The ID of the user.
 * @param {string} [userDetails.firstName] - The first name of the user.
 * @param {string} [userDetails.middleName] - The middle name of the user.
 * @param {string} [userDetails.lastName] - The last name of the user.
 * @param {number} [userDetails.genderId] - The gender ID of the user.
 * @param {string} [userDetails.dateOfBirth] - The date of birth of the user.
 * @param {string} [userDetails.profilePictureUrl] - The profile picture URL of the user.
 * @param {string} [userDetails.profilePictureThumbnailUrl] - The profile picture thumbnail URL of the user.
 * @param {string} [userDetails.publicProfilePictureThumbnailUrl] - The public profile picture thumbnail URL of the user.
 * @returns {Promise<{success: boolean, message: string, data?: Object}>} A promise that resolves to an object indicating the outcome of the request. Contains the created user details if successful.
 */
const createUserDetails = async (userDetails) => {
    try {
        const response = await fetch(`${coreBaseURL}/v1/user_details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth method
            },
            body: JSON.stringify(userDetails)
        });

        const result = await response.json();

        if (response.status === 201) {
            return { success: true, message: 'User details created successfully', data: result };
        } else {
            const message = handlingErrors(result, 'Failed to create user details, please try again.');
            return { success: false, message };
        }
    } catch (error) {
        console.error('Error creating user details:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { createUserDetails };

/**
 * Updates user details for the user whose ID matches the one in the JWT.
 *
 * @param {number} userId - The ID of the user to update.
 * @param {Object} userDetails - The user details to be updated.
 * @param {string} [userDetails.firstName] - The first name of the user.
 * @param {string} [userDetails.middleName] - The middle name of the user.
 * @param {string} [userDetails.lastName] - The last name of the user.
 * @param {number} [userDetails.genderId] - The gender ID of the user.
 * @param {string} [userDetails.dateOfBirth] - The date of birth of the user.
 * @param {string} [userDetails.profilePictureUrl] - The profile picture URL of the user.
 * @param {string} [userDetails.profilePictureThumbnailUrl] - The profile picture thumbnail URL of the user.
 * @param {string} [userDetails.publicProfilePictureThumbnailUrl] - The public profile picture thumbnail URL of the user.
 * @returns {Promise<{success: boolean, message: string, data?: Object}>} A promise that resolves to an object indicating the outcome of the request. Contains the updated user details if successful.
 */
const updateUserDetails = async (userId, userDetails) => {
    try {
        const response = await fetch(`${coreBaseURL}/v1/user_details/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth method
            },
            body: JSON.stringify(userDetails)
        });

        const result = await response.json();

        if (response.status === 200) {
            return { success: true, message: 'User details updated successfully', data: result };
        } else {
            const message = handlingErrors(result, 'Failed to update user details, please try again.');
            return { success: false, message };
        }
    } catch (error) {
        console.error('Error updating user details:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { updateUserDetails };
