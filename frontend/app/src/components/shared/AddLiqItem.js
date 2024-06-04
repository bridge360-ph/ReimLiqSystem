import React, { useState } from 'react';
import axios from 'axios';

const AddLiqItem = ({ liquidationId, onClose }) => {
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
            const response = await axios.post('/api/v1/liq/add-liq-item', {
                liquidation_id: liquidationId,
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
                <form onSubmit={handleSubmit}>
                    <label htmlFor="item">Item:</label>
                    <input type="text" id="item" value={item} onChange={handleItemChange} />
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" id="quantity" value={quantity} onChange={handleQuantityChange} />
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" value={price} onChange={handlePriceChange} />
                    <button type="submit">Add Item</button>
                </form>
            </div>
        </div>
    )
}

export default AddLiqItem