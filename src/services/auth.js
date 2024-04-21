// auth.js
const baseURL = 'https://auth.myreport.app';

const loginService = async (usernameOrEmail, password) => {
    try {
        const response = await fetch(baseURL + '/v1/login', {
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

const logoutService = async (token) => {
    try {
        const response = await fetch(baseURL + '/v1/logout', {
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

export { loginService, logoutService };
