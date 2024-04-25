import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    const [user, setUser] = useState(storedUser ? JSON.parse(storedUser): null);

    const login = (userData, remember) => {
        if (remember) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
        }
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        // Check sessionStorage first; if not found, then check localStorage
        const sessionUser = sessionStorage.getItem('user');
        const localUser = localStorage.getItem('user');
        const storedUser = sessionUser ? sessionUser : localUser;

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
