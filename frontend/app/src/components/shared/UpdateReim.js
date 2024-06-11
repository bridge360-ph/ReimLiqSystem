import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm'; // Assuming you have defined InputForm

const UpdateReim = ({ isOpen, onClose, selectedReimbursement }) => {
    const [name, setName] = useState(selectedReimbursement ? selectedReimbursement.name : '');
    const [description, setDescription] = useState(selectedReimbursement ? selectedReimbursement.description : '');
    const [error, setError] = useState(null);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(`/api/v1/reim/update-reim/${selectedReimbursement._id}`,
                { name, description }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Handle success, maybe close the modal or reset the form
                onClose();
                window.location.reload()
            } else {
                // Handle error
                console.error('Failed to update reimbursement');
                setError('Failed to update reimbursement');
            }
        } catch (error) {
            console.error('Error updating reimbursement:', error);
            setError('Error updating reimbursement');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <form onSubmit={handleSubmit} className='formcont'>
                    <InputForm
                        htmlFor="name"
                        labelText="Name"
                        type="text"
                        value={name}
                        handleChange={handleNameChange}
                        placeholder="Enter name"
                    />
                    <InputForm
                        htmlFor="description"
                        labelText="Description"
                        type="text"
                        value={description}
                        handleChange={handleDescriptionChange}
                        placeholder="Enter description"
                    />
                    <button type="submit" className="submit-button">Update</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateReim;