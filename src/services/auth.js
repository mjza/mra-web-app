const appURL = process.env.REACT_APP_BASE_URL;
const baseURL = process.env.REACT_APP_AUTH_BASE_URL;

/**
 * `loginService` handles the user login process by sending a POST request to the authentication API.
 *
 * @param {string} usernameOrEmail - The user's username or email address to be used for login.
 * @param {string} password - The user's password.
 * @returns {Promise<{success: boolean, data?: Object, message?: string}>} A promise that resolves to an object indicating the result of the login attempt. On success, it returns the user data; on failure, it returns an error message.
 */
const loginService = async (usernameOrEmail, password) => {
    try {
        const response = await fetch(`${baseURL}/v1/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usernameOrEmail, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            return { success: true, data };
        } else {
            return { success: false, message: data.message || 'Login failed, please try again.' };
        }
    } catch (error) {
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { loginService };

/**
 * `logoutService` handles the user logout process by sending a POST request to the authentication API.
 *
 * @param {string} token - The JWT token used to authenticate the logout request.
 * @returns {Promise<{success: boolean}>} A promise that resolves to an object indicating whether the logout was successful.
 * @throws {Error} Throws an error if the logout fails, which should be caught and handled by the caller.
 */
const logoutService = async (token) => {
    try {
        const response = await fetch(`${baseURL}/v1/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to logout.');
        }

        return { success: true };
    } catch (error) {
        throw error;  // Re-throw the error to be handled by the component
    }
}

export { logoutService };

/**
 * Refreshes the JWT token for a user, extending the session validity if the current token is near expiry.
 * 
 * @param {string} currentToken - The current JWT that needs to be refreshed.
 * @returns {Promise<{success: boolean, token?: string, exp?: number, userId?: number, message?: string}>} A promise that resolves to an object indicating the outcome of the token refresh attempt. On success, returns the new token and its expiry information; on failure, returns an error message.
 */
const refreshToken = async (currentToken) => {
    try {
        const response = await fetch(`${baseURL}/v1/refresh_token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            return {
                success: true,
                token: data.token,
                exp: data.exp,
                userId: data.userId
            };
        } else {
            return { success: false, message: data.message || 'Failed to refresh token.' };
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { refreshToken };

/**
 * Registers a new user with the given details.
 * 
 * @param {string} username - The username for the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user.
 * @param {string} loginRedirectURL - The URL to redirect after login, optional.
 * @returns {Promise<{success: boolean, message?: string, userId?: number}>} A promise that resolves to an object indicating the result of the registration attempt. On success, returns user ID and message; on failure, returns an error message.
 */
const registerService = async (username, email, password, loginRedirectURL = `${appURL}/signin`) => {
    try {
        const response = await fetch(`${baseURL}/v1/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, loginRedirectURL })
        });

        const data = await response.json();

        if (response.status === 201) {
            // Success case
            return { success: true, message: data.message, userId: data.userId };
        } else {
            // Handling errors
            let message = 'Registration failed, please try again.';
            if (data.errors && data.errors.length) {
                // Combine all error messages into one string
                message = 'Erros:\n' + data.errors.map((err, index) => `${index + 1}. ${err.msg}`).join('\n');
            }
            return { success: false, message: message };
        }
    } catch (error) {
        console.error('Register service error:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { registerService };

/**
 * Retrieves usernames associated with a specific email address and sends them via email.
 * 
 * @param {string} email - The email address to search for associated usernames.
 * @returns {Promise<{success: boolean, message: string}>} A promise that resolves to an object indicating the outcome of the request. Contains a message detailing the action taken.
 */
const fetchUsernamesByEmail = async (email) => {
    try {
        const response = await fetch(`${baseURL}/v1/usernames?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message || 'Failed to retrieve usernames, please try again.' };
        }
    } catch (error) {
        console.error('Error fetching usernames:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { fetchUsernamesByEmail };

/**
 * Requests generation of a password reset token for a given username.
 * The reset link is emailed to the user.
 * 
 * @param {string} username - The username for which the password reset is requested.
 * @param {string} passwordResetPageRedirectURL - The URL to redirect the user to reset their password.
 * @returns {Promise<{success: boolean, message: string}>} A promise that resolves to an object indicating the outcome of the operation. Includes a message detailing the action taken.
 */
const requestPasswordResetToken = async (username, passwordResetPageRedirectURL = `${appURL}/reset-password`) => {
    try {
        const response = await fetch(`${baseURL}/v1/reset_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, passwordResetPageRedirectURL })
        });

        const data = await response.json();

        if (response.status === 200) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message || 'Failed to generate password reset token, please try again.' };
        }
    } catch (error) {
        console.error('Error requesting password reset token:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { requestPasswordResetToken };

/**
 * Resets the password for an account using a provided username, token, and encrypted data.
 * 
 * @param {string} username - The username of the user whose password is being reset.
 * @param {string} token - The secret token required to authorize the password reset.
 * @param {string} data - Secret encrypted data required for resetting the password.
 * @param {string} newPassword - The new password to set for the user.
 * @returns {Promise<{success: boolean, message: string}>} A promise that resolves to an object indicating the outcome of the password reset attempt. Includes a message describing the success or failure of the operation.
 */
const resetPassword = async (username, token, data, newPassword) => {
    try {
        const response = await fetch(`${baseURL}/v1/reset_password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, token, data, password: newPassword })
        });

        const result = await response.json();

        if (response.status === 200) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message || 'Failed to reset password.' };
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, message: 'Network error, please try again later.' };
    }
}

export { resetPassword };
