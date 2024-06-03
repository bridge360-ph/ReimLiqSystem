import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const EmpDashboard = () => {
    const usertype = localStorage.getItem('usertype');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the usertype is not employee, navigate to login
        if (usertype !== 'employee') {
            navigate('/admdash');
        }
    }, [usertype, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Logout Successfully');
        navigate('/login');
    };



    return (
        <>
            {usertype === 'employee' && (
                <div>
                    EMP DASH
                </div>
            )}
        </>
    );
};

export default EmpDashboard;
