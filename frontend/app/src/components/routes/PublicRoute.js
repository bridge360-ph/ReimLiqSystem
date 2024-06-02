import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoutes = ({ children }) => {
    if (localStorage.getItem('token')) { // Assuming you are storing a token in localStorage
        return <Navigate to='/dashboard' />;
    } else {
        return children;
    }
};

export default PublicRoutes;
