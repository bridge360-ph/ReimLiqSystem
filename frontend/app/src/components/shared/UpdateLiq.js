import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm';

const UpdateLiq = ({ isOpen, onClose, selectedLiquidation }) => {
    const [name, setName] = useState(selectedLiquidation ? selectedLiquidation.name : '');
    const [description, setDescription] = useState(selectedLiquidation ? selectedLiquidation.description : '');
    const [initial_amount, setInitialAmount] = useState(selectedLiquidation ? selectedLiquidation.initial_amount : '');
    const [error, setError] = useState(null);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleAmountChange = (e) => {
        setInitialAmount(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(`https://reimapi.onrender.com/api/v1/liq/update-liq/${selectedLiquidation._id}`,
                { name, description, initial_amount }, {
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
                console.error('Failed to update liquidation');
                setError('Failed to update liquidation');
            }
        } catch (error) {
            console.error('Error updating liquidation:', error);
            setError('Error updating liquidation');
        }
    };


    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            {error}
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
                    <InputForm
                        htmlFor="Amount"
                        labelText="Initial Amount"
                        type="number"
                        value={initial_amount}
                        handleChange={handleAmountChange}
                        placeholder="Enter Amount"
                    />
                    <button type="submit" className="submit-button">Update</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateLiq