import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import InputForm from './InputForm';
import { toast } from 'react-toastify';// Ensure you have the CSS for styling

const AddReim = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

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
            const response = await axios.post('/api/v1/reim/add-reim', { name, description }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                // Handle success, maybe close the modal or reset the form
                onClose();
                setName('');
                setDescription('');
                toast.success('Created Successfuly')
                window.location.reload();
            } else {
                // Handle error
                console.error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddReim;
