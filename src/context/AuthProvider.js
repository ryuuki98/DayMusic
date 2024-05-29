import React, { useState } from 'react';
import AuthContext from './AuthContext';
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (userData) => {
        setCurrentUser(userData);
    }

    const logout = () => {
        setCurrentUser(null);
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}  
        </AuthContext.Provider>
    );
};

export default AuthProvider;
