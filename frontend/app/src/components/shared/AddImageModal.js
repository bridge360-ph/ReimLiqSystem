import React, { useState } from 'react';
import axios from 'axios';

const AddImageModal = ({ isOpen, onClose, reimbursementId }) => {
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setError('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('testImage', image);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.patch(`http://localhost:8080/api/v1/reim/add-image/${reimbursementId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setError('');
                onClose();
            } else {
                setError(response.data.message || 'Failed to upload image');
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            setError(err.message || 'Error uploading image');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}>&times;</span>
                <h2>Upload Image</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
};

export default AddImageModal;
