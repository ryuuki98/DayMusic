import React, { useState } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({children}) => {

    const [currentUser, setCurrentUser ]= useState(null);

    const login = () => {

    }

    const logout = () => {

    }

    return (
        <AuthContext.Provider value={currentUser}>
          {children}  
        </AuthContext.Provider>
    );
};

export default AuthProvider;