import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const AdminDash = () => {
    const usertype = localStorage.getItem('usertype');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the usertype is not admin, navigate to empdash
        if (usertype !== 'admin') {
            navigate('/empdash');
        }
    }, [usertype, navigate]);


    return (
        <>
            {usertype === 'admin' && (
                <div>
                    ADM DASH

                </div>
            )}
        </>
    );
};

export default AdminDash;
