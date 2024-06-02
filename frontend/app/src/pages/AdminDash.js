import React from 'react'
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const AdminDash = () => {
    const navigate = useNavigate()
    const handleLogout = () => {

        localStorage.clear();

        toast.success('Logout Successfully');

        navigate('/login');
        window.location.reload();
    };
    return (
        <Link onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-door-closed-fill icon" viewBox="0 0 16 16">
                <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
            Logout
        </Link>
    )
}

export default AdminDash