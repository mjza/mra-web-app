import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    const { exp } = storedUser ? JSON.parse(storedUser) : {};
    // Get the current time in Unix timestamp format (seconds since Epoch)
    const now = Math.floor(Date.now() / 1000);
    const [user, setUser] = useState(exp > now ? JSON.parse(storedUser) : null);

    const login = (userData, remember) => {
        if (remember) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
        }
        setUser(userData);
    };

    const logout = () => {
        const { exp } = user;
        // Get the current time in Unix timestamp format (seconds since Epoch)
        const now = Math.floor(Date.now() / 1000);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setUser(null);
        return exp > now;
    };

    useEffect(() => {
        // Check sessionStorage first; if not found, then check localStorage
        const sessionUser = sessionStorage.getItem('user');
        const localUser = localStorage.getItem('user');
        const storedUser = sessionUser ? sessionUser : localUser;
        const { exp } = storedUser ? JSON.parse(storedUser) : {};
        // Get the current time in Unix timestamp format (seconds since Epoch)
        const now = Math.floor(Date.now() / 1000);

        // Compare the expiration time with the current time
        if (exp > now) {
            setUser(JSON.parse(storedUser));
        } else {
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
