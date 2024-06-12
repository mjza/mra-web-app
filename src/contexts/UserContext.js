import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const fetchProfilePicture = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);
        return base64;
    } catch (error) {
        console.error('Failed to fetch profile picture', error);
        return null;
    }
};

export const UserProvider = ({ children }) => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    const { exp } = storedUser ? JSON.parse(storedUser) : {};
    const now = Math.floor(Date.now() / 1000);
    const [user, setUser] = useState(exp > now ? JSON.parse(storedUser) : null);

    const login = async (userData, remember) => {
        const profilePictureUrl = userData.profilePictureUrl || '/images/avatar.jpg';
        const profilePictureBase64 = await fetchProfilePicture(profilePictureUrl);
        const updatedUserData = { ...userData, profilePictureBase64 };

        if (remember) {
            localStorage.setItem('user', JSON.stringify(updatedUserData));
        } else {
            sessionStorage.setItem('user', JSON.stringify(updatedUserData));
        }
        setUser(updatedUserData);
    };

    const logout = () => {
        const { exp } = user;
        const now = Math.floor(Date.now() / 1000);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setUser(null);
        return exp > now;
    };

    const updateUserData = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        const userDataString = JSON.stringify(updatedUser);

        if (sessionStorage.getItem('user')) {
            sessionStorage.setItem('user', userDataString);
        } else {
            localStorage.setItem('user', userDataString);
        }
    };

    const updateProfilePictureUrl = async (newUrl) => {
        const profilePictureUrl = newUrl || '/images/avatar.jpg';
        const profilePictureBase64 = await fetchProfilePicture(profilePictureUrl);
        updateUserData({ profilePictureUrl: newUrl, profilePictureBase64 });
    };

    const updateDisplayName = (newDisplayName) => {
        updateUserData({ displayName: newDisplayName });
    };

    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        const localUser = localStorage.getItem('user');
        const storedUser = sessionUser ? sessionUser : localUser;
        const { exp } = storedUser ? JSON.parse(storedUser) : {};
        const now = Math.floor(Date.now() / 1000);

        if (exp > now) {
            setUser(JSON.parse(storedUser));
        } else {
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout, updateProfilePictureUrl, updateDisplayName }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
