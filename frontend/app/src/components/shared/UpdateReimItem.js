// UpdateReimItem.jsx

import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm'; // Assuming you have defined InputForm

const UpdateReimItem = ({ isOpen, onClose, selectedItem }) => {
    const [updatedItem, setUpdatedItem] = useState(selectedItem || { item: '', price: '', quantity: '', total_price: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const itemId = selectedItem._id;
        try {
            const response = await axios.put(`https://reimapi.onrender.com/api/v1/reim/update-reim-item/${itemId}`,
                updatedItem, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                onClose(); // Close the modal
                window.location.reload(); // Refresh the page
            } else {
                console.error('Failed to update item');
                setError('Failed to update item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
            setError('Error updating item');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            {error}
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <form onSubmit={handleSubmit} className='formcont'>
                    <InputForm
                        htmlFor="item"
                        labelText="Item:"
                        type="text"
                        name="item"
                        value={updatedItem.item}
                        handleChange={handleChange}
                        placeholder="Enter item"
                    />
                    <InputForm
                        htmlFor="price"
                        labelText="Price:"
                        type="number"
                        name="price"
                        value={updatedItem.price}
                        handleChange={handleChange}
                        placeholder="Enter price"
                    />
                    <InputForm
                        htmlFor="quantity"
                        labelText="Quantity:"
                        type="number"
                        name="quantity"
                        value={updatedItem.quantity}
                        handleChange={handleChange}
                        placeholder="Enter quantity"
                    />
                    <button type="submit" className="submit-button">Update Item</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateReimItem;