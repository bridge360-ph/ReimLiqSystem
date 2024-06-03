import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoutes = ({ children, setUsertype }) => {
    const usertype = localStorage.getItem('usertype');
    const token = localStorage.getItem('token');

    if (token) {
        if (usertype === 'employee') {
            return <Navigate to='/empdash' />;
        } else if (usertype === 'admin') {
            return <Navigate to='/admdash' />;
        }
    } else {
        return children;
    }
};

export default PublicRoutes;
