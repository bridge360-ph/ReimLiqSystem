import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/settings.css'

const Settings = () => {

    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };


    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        position: ''
    });

    const handleimageSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setError('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('testImage', image);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.patch(`http://localhost:8080/api/v1/user/addImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setError('');
                window.location.reload()
            } else {
                setError(response.data.message || 'Failed to upload image');
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            setError(err.message || 'Error uploading image');
        }
    };

    useEffect(() => {
        // Assuming you need to fetch and prefill data when the component mounts
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/v1/user/get-user/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.success) {
                    setFormData({
                        fullname: response.data.user.fullname || '',
                        email: response.data.user.email || '',
                        password: '', // Assume password is not returned for security reasons
                        position: response.data.user.position || ''
                    });
                } else {
                    toast.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Error fetching user data');
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            const usertype = localStorage.getItem('usertype');
            const token = localStorage.getItem('token');
            const url = usertype === 'admin'
                ? `/api/v1/user/adm-update/${userId}`
                : `/api/v1/user/emp-update/${userId}`;

            const response = await axios.put(url, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('User information updated successfully');
                window.location.reload()
            } else {
                toast.error('Failed to update user information');
            }
        } catch (error) {
            console.error('Error updating user information:', error);
            toast.error('Error updating user information');
        }
    };

    return (<>
        <h2 className='settings-header'>SETTINGS</h2>
        <div className="settings-container">
            <h2>Update Your Credentials</h2>
            <form onSubmit={handleSubmit} className='settings-form'>
                <div className="form-group">
                    <label htmlFor="fullname">Full Name:</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="position">Position:</label>
                    <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className='settings-button'>
                    {localStorage.getItem('usertype') === 'admin' ? 'UPDATE' : 'UPDATE'}
                </button>
            </form>
            <ToastContainer />

            <div>
                <h2>Upload Image</h2>
                <form onSubmit={handleimageSubmit}>
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    </>);
};

export default Settings;
