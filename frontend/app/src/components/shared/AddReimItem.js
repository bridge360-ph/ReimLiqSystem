// AddReimItem.js
import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm';

const AddReimItem = ({ reimbursementId, onClose }) => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleItemChange = (e) => {
        setItem(e.target.value);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('https://reimapi.onrender.com/api/v1/reim/add-reim-item', {
                reimbursement_id: reimbursementId,
                item,
                quantity,
                price
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                onClose();
            } else {
                console.error('Failed to add item');
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <form onSubmit={handleSubmit} className='formcont'>
                    <InputForm
                        htmlFor="item"
                        labelText="Item: "
                        type="text"
                        value={item}
                        handleChange={handleItemChange}
                        placeholder="Enter item"
                    />
                    <InputForm
                        htmlFor="quantity"
                        labelText="Quantity: "
                        type="number"
                        value={quantity}
                        handleChange={handleQuantityChange}
                        placeholder="Enter quantity"
                    />
                    <InputForm
                        htmlFor="price"
                        labelText="Price: "
                        type="number"
                        value={price}
                        handleChange={handlePriceChange}
                        placeholder="Enter price"
                    />
                    <button type="submit">Add Item</button>
                </form>
            </div>
        </div>
    );
};

export default AddReimItem;
