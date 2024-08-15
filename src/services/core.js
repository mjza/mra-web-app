import { handlingErrors, createQueryParams } from './utils'; 

const coreBaseURL = process.env.REACT_APP_CORE_BASE_URL;

/**
 * Retrieves gender types with optional pagination.
 *
 * @param {string} token - The JWT token used to authenticate the request.
 * @param {Object} params - The parameters for the request.
 * @param {number} [params.page=1] - Page number of the gender types to retrieve.
 * @param {number} [params.limit=30] - Maximum number of gender types to return in one response.
 * @returns {Promise<{success: boolean, message: string, data?: Object[], hasMore?: boolean}>} A promise that resolves to an object indicating the outcome of the request. Contains the gender types data if successful.
 */
const fetchGenderTypes = async ({ page = 1, limit = 30 } = {}) => {
    try {
        const queryParams = new URLSearchParams({ page, limit });
        const response = await fetch(`${coreBaseURL}/v1/gender_types?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();

        if (response.status === 200) {
            return { success: true, message: 'Gender types retrieved successfully', data: result.data, hasMore: result.hasMore };
        } else {
            const message = handlingErrors(result, 'Failed to retrieve gender types, please try again.');
            return { success: false, message };
        }
    } catch (error) {
        console.error('Error fetching gender types:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { fetchGenderTypes };

/**
 * Retrieves user details based on provided conditions and pagination.
 *
 * @param {string} token - The JWT token used to authenticate the logout request.
 * @param {Object} params - The parameters for the request.
 * @param {number} [params.userId] - Optional user ID to retrieve details for a specific user.
 * @param {number} [params.page=1] - Page number of the user details to retrieve.
 * @param {number} [params.limit=30] - Maximum number of user details to return in one response.
 * @returns {Promise<{success: boolean, message: string, data?: Object[], hasMore?: boolean}>} A promise that resolves to an object indicating the outcome of the request. Contains the user details data if successful.
 */
const fetchUserDetails = async (token, { userId, page = 1, limit = 30 } = {}) => {
    try {
        const queryParams = new URLSearchParams({ userId, page, limit });
        const response = await fetch(`${coreBaseURL}/v1/user_details?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
 * @param {string} token - The JWT token used to authenticate the logout request.
 * @param {Object} userDetails - The user details to be created.
 * @param {number} userDetails.userId - The ID of the user.
 * @param {string} [userDetails.firstName] - The first name of the user.
 * @param {string} [userDetails.middleName] - The middle name of the user.
 * @param {string} [userDetails.lastName] - The last name of the user.
 * @param {number} [userDetails.genderId] - The gender ID of the user.
 * @param {string} [userDetails.dateOfBirth] - The date of birth of the user.
 * @param {string} [userDetails.profilePictureUrl] - The profile picture URL of the user.
 * @param {boolean} [userDetails.isPrivatePicture] - True, if the profile picture must not be shown to public.
 * @returns {Promise<{success: boolean, message: string, data?: Object}>} A promise that resolves to an object indicating the outcome of the request. Contains the created user details if successful.
 */
const createUserDetails = async (token, userDetails) => {
    try {
        const response = await fetch(`${coreBaseURL}/v1/user_details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
 * @param {string} token - The JWT token used to authenticate the logout request.
 * @param {number} userId - The ID of the user to update.
 * @param {Object} userDetails - The user details to be updated.
 * @param {string} [userDetails.firstName] - The first name of the user.
 * @param {string} [userDetails.middleName] - The middle name of the user.
 * @param {string} [userDetails.lastName] - The last name of the user.
 * @param {number} [userDetails.genderId] - The gender ID of the user.
 * @param {string} [userDetails.dateOfBirth] - The date of birth of the user.
 * @param {string} [userDetails.profilePictureUrl] - The profile picture URL of the user.
 * @param {boolean} [userDetails.isPrivatePicture] - True, if the profile picture must not be shown to public.
 * @returns {Promise<{success: boolean, message: string, data?: Object}>} A promise that resolves to an object indicating the outcome of the request. Contains the updated user details if successful.
 */
const updateUserDetails = async (token, userId, userDetails) => {
    try {
        const response = await fetch(`${coreBaseURL}/v1/user_details/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

/**
 * Retrieves ticket categories based on provided conditions and pagination.
 *
 * @param {string} token - The JWT token used to authenticate the request.
 * @param {Object} params - The parameters for the request.
 * @param {string} [params.ticketTitle] - Optional ticket title to search for similar categories.
 * @param {number} [params.latitude] - Optional latitude for geolocation-based filtering.
 * @param {number} [params.longitude] - Optional longitude for geolocation-based filtering.
 * @param {number} [params.customerId] - Optional customer ID to filter categories. Takes priority over customerTypeId if set.
 * @param {number} [params.customerTypeId] - Optional customer type ID to filter categories. Ignored if customerId is set.
 * @param {number} [params.page=1] - Page number of the ticket categories to retrieve.
 * @param {number} [params.limit=30] - Maximum number of ticket categories to return in one response.
 * @returns {Promise<{success: boolean, message: string, data?: Object[], hasMore?: boolean}>} A promise that resolves to an object indicating the outcome of the request. Contains the ticket categories data if successful.
 */
const fetchTicketCategories = async (token, { ticketTitle, latitude, longitude, customerId, customerTypeId, page = 1, limit = 30 } = {}) => {
    try {
        const queryParams = createQueryParams({
            ticketTitle,
            latitude,
            longitude,
            customerId,
            customerTypeId,
            page,
            limit
        });        

        const response = await fetch(`${coreBaseURL}/v1/ticket_categories?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.status === 200) {
            return { success: true, message: 'Ticket categories retrieved successfully', data: result.data, hasMore: result.hasMore };
        } else {
            const message = handlingErrors(result, 'Failed to retrieve ticket categories, please try again.');
            return { success: false, message };
        }
    } catch (error) {
        console.error('Error fetching ticket categories:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { fetchTicketCategories };

